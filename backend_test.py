#!/usr/bin/env python3
"""
Backend API Testing for Jonesaica Infrastructure Solutions
Tests all API endpoints: products, leads, quotes
"""

import requests
import sys
import json
from datetime import datetime

class JonesaicaAPITester:
    def __init__(self, base_url="https://solar-solutions-ja.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root", success, details)
            return success
        except Exception as e:
            self.log_test("API Root", False, str(e))
            return False

    def test_get_products(self):
        """Test GET /products endpoint"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                products = response.json()
                details += f", Products count: {len(products)}"
                if len(products) > 0:
                    # Check product structure
                    product = products[0]
                    required_fields = ['id', 'name', 'category', 'regular_price', 'sale_price']
                    missing_fields = [field for field in required_fields if field not in product]
                    if missing_fields:
                        success = False
                        details += f", Missing fields: {missing_fields}"
                    else:
                        details += f", Sample product: {product['name']}"
                else:
                    success = False
                    details += ", No products found"
            
            self.log_test("GET Products", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("GET Products", False, str(e))
            return False, []

    def test_get_products_by_category(self):
        """Test GET /products with category filter"""
        categories = ["inverters", "batteries", "panels"]
        all_success = True
        
        for category in categories:
            try:
                response = requests.get(f"{self.api_url}/products?category={category}", timeout=10)
                success = response.status_code == 200
                details = f"Status: {response.status_code}"
                
                if success:
                    products = response.json()
                    details += f", {category} count: {len(products)}"
                    # Verify all products are of the correct category
                    if products:
                        wrong_category = [p for p in products if p.get('category') != category]
                        if wrong_category:
                            success = False
                            details += f", Wrong category products: {len(wrong_category)}"
                
                self.log_test(f"GET Products - {category}", success, details)
                if not success:
                    all_success = False
                    
            except Exception as e:
                self.log_test(f"GET Products - {category}", False, str(e))
                all_success = False
        
        return all_success

    def test_create_lead(self):
        """Test POST /leads endpoint"""
        test_lead = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "876-555-0123",
            "parish": "St. James",
            "district": "Montego Bay",
            "interest": "solar",
            "message": "Test lead submission"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/leads", 
                json=test_lead,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                lead_data = response.json()
                details += f", Lead ID: {lead_data.get('id', 'No ID')}"
                # Verify required fields are returned
                required_fields = ['id', 'name', 'email', 'created_at']
                missing_fields = [field for field in required_fields if field not in lead_data]
                if missing_fields:
                    success = False
                    details += f", Missing response fields: {missing_fields}"
            
            self.log_test("POST Lead", success, details)
            return success
        except Exception as e:
            self.log_test("POST Lead", False, str(e))
            return False

    def test_create_quote(self):
        """Test POST /quotes endpoint"""
        test_quote = {
            "name": f"Quote User {datetime.now().strftime('%H%M%S')}",
            "email": f"quote{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "876-555-0456",
            "parish": "Trelawny",
            "district": "Falmouth",
            "interest": "solar",
            "products": [],
            "service_description": "Need solar installation for 3-bedroom house",
            "message": "Test quote request"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/quotes", 
                json=test_quote,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                quote_data = response.json()
                details += f", Quote ID: {quote_data.get('id', 'No ID')}"
                # Verify required fields are returned
                required_fields = ['id', 'name', 'email', 'status', 'created_at']
                missing_fields = [field for field in required_fields if field not in quote_data]
                if missing_fields:
                    success = False
                    details += f", Missing response fields: {missing_fields}"
            
            self.log_test("POST Quote", success, details)
            return success
        except Exception as e:
            self.log_test("POST Quote", False, str(e))
            return False

    def test_seed_products(self):
        """Test POST /seed-products endpoint"""
        try:
            response = requests.post(f"{self.api_url}/seed-products", timeout=15)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                result = response.json()
                details += f", Message: {result.get('message', 'No message')}"
            
            self.log_test("POST Seed Products", success, details)
            return success
        except Exception as e:
            self.log_test("POST Seed Products", False, str(e))
            return False

    def test_get_leads(self):
        """Test GET /leads endpoint"""
        try:
            response = requests.get(f"{self.api_url}/leads", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                leads = response.json()
                details += f", Leads count: {len(leads)}"
            
            self.log_test("GET Leads", success, details)
            return success
        except Exception as e:
            self.log_test("GET Leads", False, str(e))
            return False

    def test_get_quotes(self):
        """Test GET /quotes endpoint"""
        try:
            response = requests.get(f"{self.api_url}/quotes", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                quotes = response.json()
                details += f", Quotes count: {len(quotes)}"
            
            self.log_test("GET Quotes", success, details)
            return success
        except Exception as e:
            self.log_test("GET Quotes", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting API tests for {self.base_url}")
        print("=" * 60)
        
        # Test API connectivity first
        if not self.test_api_root():
            print("❌ API root failed - stopping tests")
            return False
        
        # Seed products first
        self.test_seed_products()
        
        # Test product endpoints
        success, products = self.test_get_products()
        if success and products:
            self.test_get_products_by_category()
        
        # Test lead creation and retrieval
        self.test_create_lead()
        self.test_get_leads()
        
        # Test quote creation and retrieval
        self.test_create_quote()
        self.test_get_quotes()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = JonesaicaAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': tester.tests_passed / tester.tests_run if tester.tests_run > 0 else 0,
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())