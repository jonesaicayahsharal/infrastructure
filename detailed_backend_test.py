#!/usr/bin/env python3
"""
Detailed Backend API Testing for Jonesaica Infrastructure Solutions
Tests specific requirements from the review request
"""

import requests
import sys
import json
from datetime import datetime

class DetailedAPITester:
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

    def test_product_count_and_structure(self):
        """Test that exactly 14 products are returned with correct structure"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            if response.status_code != 200:
                self.log_test("Product Count & Structure", False, f"API returned {response.status_code}")
                return False
            
            products = response.json()
            
            # Check count
            if len(products) != 14:
                self.log_test("Product Count & Structure", False, f"Expected 14 products, got {len(products)}")
                return False
            
            # Check structure of each product
            required_fields = ['id', 'name', 'category', 'description', 'regular_price', 'sale_price', 'image_url', 'in_stock', 'backorder']
            for i, product in enumerate(products):
                missing_fields = [field for field in required_fields if field not in product]
                if missing_fields:
                    self.log_test("Product Count & Structure", False, f"Product {i+1} missing fields: {missing_fields}")
                    return False
            
            self.log_test("Product Count & Structure", True, f"14 products with all required fields")
            return True
            
        except Exception as e:
            self.log_test("Product Count & Structure", False, str(e))
            return False

    def test_category_counts(self):
        """Test category filtering returns correct counts"""
        expected_counts = {
            "inverters": 4,
            "batteries": 7, 
            "panels": 3
        }
        
        all_success = True
        
        for category, expected_count in expected_counts.items():
            try:
                response = requests.get(f"{self.api_url}/products?category={category}", timeout=10)
                if response.status_code != 200:
                    self.log_test(f"Category Count - {category}", False, f"API returned {response.status_code}")
                    all_success = False
                    continue
                
                products = response.json()
                actual_count = len(products)
                
                if actual_count != expected_count:
                    self.log_test(f"Category Count - {category}", False, f"Expected {expected_count}, got {actual_count}")
                    all_success = False
                else:
                    # Verify all products are actually of the correct category
                    wrong_category = [p for p in products if p.get('category') != category]
                    if wrong_category:
                        self.log_test(f"Category Count - {category}", False, f"{len(wrong_category)} products have wrong category")
                        all_success = False
                    else:
                        self.log_test(f"Category Count - {category}", True, f"{actual_count} {category} products")
                        
            except Exception as e:
                self.log_test(f"Category Count - {category}", False, str(e))
                all_success = False
        
        return all_success

    def test_inverter_products(self):
        """Test that 4 Deye inverters are returned with correct names"""
        try:
            response = requests.get(f"{self.api_url}/products?category=inverters", timeout=10)
            if response.status_code != 200:
                self.log_test("Inverter Products", False, f"API returned {response.status_code}")
                return False
            
            inverters = response.json()
            expected_inverters = ["6kW", "8kW", "10kW", "12kW"]
            
            found_inverters = []
            for inverter in inverters:
                name = inverter.get('name', '')
                for expected in expected_inverters:
                    if expected in name and 'Deye' in name:
                        found_inverters.append(expected)
                        break
            
            if len(found_inverters) != 4:
                self.log_test("Inverter Products", False, f"Expected 4 Deye inverters (6kW, 8kW, 10kW, 12kW), found: {found_inverters}")
                return False
            
            missing = [inv for inv in expected_inverters if inv not in found_inverters]
            if missing:
                self.log_test("Inverter Products", False, f"Missing inverters: {missing}")
                return False
            
            self.log_test("Inverter Products", True, f"Found all 4 Deye inverters: {found_inverters}")
            return True
            
        except Exception as e:
            self.log_test("Inverter Products", False, str(e))
            return False

    def test_panel_stock_status(self):
        """Test panel stock status: SunPower 450W in stock, 545W sold out, TW 625W backorder"""
        try:
            response = requests.get(f"{self.api_url}/products?category=panels", timeout=10)
            if response.status_code != 200:
                self.log_test("Panel Stock Status", False, f"API returned {response.status_code}")
                return False
            
            panels = response.json()
            
            # Find specific panels
            sunpower_450 = None
            sunpower_545 = None
            tw_625 = None
            
            for panel in panels:
                name = panel.get('name', '').lower()
                if 'sunpower' in name and '450' in name:
                    sunpower_450 = panel
                elif 'sunpower' in name and '545' in name:
                    sunpower_545 = panel
                elif 'tw' in name and '625' in name:
                    tw_625 = panel
            
            errors = []
            
            # Check SunPower 450W: in_stock=true, backorder=false
            if not sunpower_450:
                errors.append("SunPower 450W not found")
            elif not (sunpower_450.get('in_stock') == True and sunpower_450.get('backorder') == False):
                errors.append(f"SunPower 450W: expected in_stock=true, backorder=false, got in_stock={sunpower_450.get('in_stock')}, backorder={sunpower_450.get('backorder')}")
            
            # Check SunPower 545W: in_stock=false, backorder=false (SOLD OUT)
            if not sunpower_545:
                errors.append("SunPower 545W not found")
            elif not (sunpower_545.get('in_stock') == False and sunpower_545.get('backorder') == False):
                errors.append(f"SunPower 545W: expected in_stock=false, backorder=false, got in_stock={sunpower_545.get('in_stock')}, backorder={sunpower_545.get('backorder')}")
            
            # Check TW 625W: in_stock=true, backorder=true (BACKORDER)
            if not tw_625:
                errors.append("TW 625W not found")
            elif not (tw_625.get('in_stock') == True and tw_625.get('backorder') == True):
                errors.append(f"TW 625W: expected in_stock=true, backorder=true, got in_stock={tw_625.get('in_stock')}, backorder={tw_625.get('backorder')}")
            
            if errors:
                self.log_test("Panel Stock Status", False, "; ".join(errors))
                return False
            
            self.log_test("Panel Stock Status", True, "All panel stock statuses correct")
            return True
            
        except Exception as e:
            self.log_test("Panel Stock Status", False, str(e))
            return False

    def test_pricing_structure(self):
        """Test specific pricing: SunPower 450W and Deye 6kW pricing"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            if response.status_code != 200:
                self.log_test("Pricing Structure", False, f"API returned {response.status_code}")
                return False
            
            products = response.json()
            
            # Find specific products
            sunpower_450 = None
            deye_6kw = None
            
            for product in products:
                name = product.get('name', '').lower()
                if 'sunpower' in name and '450' in name:
                    sunpower_450 = product
                elif 'deye' in name and '6k' in name:
                    deye_6kw = product
            
            errors = []
            
            # Check SunPower 450W: sale_price=18000, regular_price=21000
            if not sunpower_450:
                errors.append("SunPower 450W not found")
            elif sunpower_450.get('sale_price') != 18000 or sunpower_450.get('regular_price') != 21000:
                errors.append(f"SunPower 450W: expected sale=18000, regular=21000, got sale={sunpower_450.get('sale_price')}, regular={sunpower_450.get('regular_price')}")
            
            # Check Deye 6kW: sale_price=289000, regular_price=421500
            if not deye_6kw:
                errors.append("Deye 6kW not found")
            elif deye_6kw.get('sale_price') != 289000 or deye_6kw.get('regular_price') != 421500:
                errors.append(f"Deye 6kW: expected sale=289000, regular=421500, got sale={deye_6kw.get('sale_price')}, regular={deye_6kw.get('regular_price')}")
            
            if errors:
                self.log_test("Pricing Structure", False, "; ".join(errors))
                return False
            
            self.log_test("Pricing Structure", True, "Pricing structure correct")
            return True
            
        except Exception as e:
            self.log_test("Pricing Structure", False, str(e))
            return False

    def test_lead_api_functionality(self):
        """Test lead capture API with realistic data"""
        test_lead = {
            "name": "Marcus Johnson",
            "email": "marcus.johnson@email.com",
            "phone": "876-555-7890",
            "parish": "St. Catherine",
            "district": "Spanish Town",
            "interest": "solar",
            "specific_needs": "Need solar system for 4-bedroom house with pool"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/leads", 
                json=test_lead,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Lead API Functionality", False, f"API returned {response.status_code}: {response.text}")
                return False
            
            lead_data = response.json()
            
            # Verify required fields are returned
            required_fields = ['id', 'name', 'email', 'phone', 'parish', 'district', 'interest', 'created_at']
            missing_fields = [field for field in required_fields if field not in lead_data]
            if missing_fields:
                self.log_test("Lead API Functionality", False, f"Missing response fields: {missing_fields}")
                return False
            
            # Verify data integrity
            if lead_data.get('name') != test_lead['name'] or lead_data.get('email') != test_lead['email']:
                self.log_test("Lead API Functionality", False, "Response data doesn't match input")
                return False
            
            self.log_test("Lead API Functionality", True, f"Lead created with ID: {lead_data.get('id')}")
            return True
            
        except Exception as e:
            self.log_test("Lead API Functionality", False, str(e))
            return False

    def run_detailed_tests(self):
        """Run all detailed API tests"""
        print(f"🔍 Starting detailed API tests for {self.base_url}")
        print("=" * 70)
        
        # Seed products first
        try:
            response = requests.post(f"{self.api_url}/seed-products", timeout=15)
            if response.status_code == 200:
                print("✅ Products seeded successfully")
            else:
                print(f"⚠️  Seed products returned {response.status_code}")
        except Exception as e:
            print(f"⚠️  Seed products failed: {e}")
        
        print("-" * 70)
        
        # Run detailed tests
        self.test_product_count_and_structure()
        self.test_category_counts()
        self.test_inverter_products()
        self.test_panel_stock_status()
        self.test_pricing_structure()
        self.test_lead_api_functionality()
        
        # Print summary
        print("=" * 70)
        print(f"📊 Detailed tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All detailed tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} detailed tests failed")
            return False

def main():
    tester = DetailedAPITester()
    success = tester.run_detailed_tests()
    
    # Save detailed results
    with open('/app/detailed_backend_test_results.json', 'w') as f:
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