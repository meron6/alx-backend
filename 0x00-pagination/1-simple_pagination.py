#!/usr/bin/env python3
"""Simple Pagination Script"""
import csv
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for those
    particular pagination parameters.
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return start_index, end_index


class Server:
    """Server class to paginate a database of popular baby names."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Return cached dataset."""
        if self.__dataset is None:
            with open(self.DATA_FILE, mode='r') as file:
                reader = csv.reader(file)
                self.__dataset = list(reader)[1:]  # Exclude header
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Fetch the page of baby names."""
        assert isinstance(page, int) and isinstance(page_size, int) and page > 0 and page_size > 0
        start_index, end_index = index_range(page, page_size)
        return self.__dataset[start_index:end_index] if self.__dataset else []
