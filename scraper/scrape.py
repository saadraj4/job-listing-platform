import os, sys, time, json, requests, re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    NoSuchElementException,
    TimeoutException,
    ElementClickInterceptedException
)

# --- Utility: Remove emojis and non-ASCII characters ---
def clean_text(text):
    if not text:
        return "N/A"
    # Remove emojis and non-ASCII characters
    text = re.sub(r"[^\x00-\x7F]+", "", text)
    # Remove excessive spaces or commas
    text = re.sub(r"\s+", " ", text).strip().strip(",")
    return text

# --- Selenium setup ---
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("--disable-infobars")
chrome_options.add_argument("--disable-extensions")

driver = webdriver.Chrome(service=Service(), options=chrome_options)
wait = WebDriverWait(driver, 20)

url = "https://www.actuarylist.com"
driver.get(url)

page = 1
max_pages = 2
all_jobs = []

print("Scraping ActuaryList...")

try:
    while page <= max_pages:
        print(f"\nScraping Page {page}...")
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "article")))
        time.sleep(2)

        job_cards = driver.find_elements(By.CSS_SELECTOR, "article")
        print(f"Found {len(job_cards)} jobs on page {page}")

        for card in job_cards:
            try:
                company = clean_text(card.find_element(By.CSS_SELECTOR, "p.Job_job-card__company__7T9qY").text)
                title = clean_text(card.find_element(By.CSS_SELECTOR, "p.Job_job-card__position__ic1rc").text)
                link = card.find_element(By.CSS_SELECTOR, "a.Job_job-page-link__a5I5g").get_attribute("href")
                salary = card.find_element(By.CSS_SELECTOR, "p.Job_job-card__salary__QZswp").text if card.find_elements(By.CSS_SELECTOR, "p.Job_job-card__salary__QZswp") else "N/A"
                salary = clean_text(salary)
                locations = [clean_text(loc.text) for loc in card.find_elements(By.CSS_SELECTOR, "a.Job_job-card__location__bq7jX")]
                tags = [clean_text(tag.text) for tag in card.find_elements(By.CSS_SELECTOR, "div.Job_job-card__tags__zfriA a")]
                date_posted = card.find_element(By.CSS_SELECTOR, "p.Job_job-card__posted-on__NCZaJ").text if card.find_elements(By.CSS_SELECTOR, "p.Job_job-card__posted-on__NCZaJ") else "N/A"

                # Determine job type
                job_type = "Full-time"
                for t in tags:
                    if any(x in t.lower() for x in ["intern", "part", "contract", "temporary"]):
                        job_type = t
                        break

                all_jobs.append({
                    "title": title,
                    "company": company,
                    "location": ", ".join(locations) or "N/A",
                    "salary": salary,
                    "description": link,  # currently storing link only
                    "job_type": job_type,
                    "tags": ", ".join(tags),
                    "posting_date": date_posted,
                })

            except Exception as e:
                print(f"Error parsing card: {e}")

        # Handle pagination
        try:
            next_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Next')]")))
            driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
            time.sleep(1)
            next_button.click()
            print("Going to next page...")
            page += 1
            time.sleep(3)
        except (NoSuchElementException, TimeoutException):
            print("No more pages.")
            break
        except ElementClickInterceptedException:
            print("⚠️ Next button overlapped — retrying JS click...")
            driver.execute_script("arguments[0].click();", next_button)
            page += 1
            time.sleep(3)

    print(f"\n✅ Scraping complete. Total jobs: {len(all_jobs)}")

except Exception as e:
    print(f"Unexpected error: {e}")

finally:
    driver.quit()

# --- Send scraped data to backend ---
if all_jobs:
    print("📡 Sending jobs to backend API...")
    try:
        response = requests.post(
            "http://127.0.0.1:5000/api/jobs/bulk",
            json=all_jobs, 
            timeout=30
        )
        print("✅ API Response:", response.json())
    except Exception as e:
        print(f"Failed to send jobs to backend: {e}")
