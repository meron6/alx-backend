#!/usr/bin/env python3
"""0. Basic dictionary"""

BaseCaching = __import__("base_caching").BaseCaching

class BasicCache(BaseCaching):
    """BasicCache class that inherits from BaseCaching
    and implements a simple caching system"""
    
    def put(self, key, item):
        """Add an item to the cache"""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key"""
        if key is not None:
            return self.cache_data.get(key, None)
        return None
