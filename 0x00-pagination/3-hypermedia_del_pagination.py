#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Skip the header row

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by original position, starting at 0."""
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Return a dictionary containing:
        - 'index': the current start index of the return page.
        - 'data': the actual page of the dataset.
        - 'page_size': the length of the returned dataset page.
        - 'next_index': the start index for the next page.
        """
        assert isinstance(index, int) and isinstance(page_size, int), \
            "index and page_size must be integers"
        assert index >= 0 and page_size > 0, "index and page_size must be positive"

        dataset = self.indexed_dataset()
        dataset_size = len(dataset)
        assert index < dataset_size, "index out of range"

        data = []
        next_index = index

        while len(data) < page_size and next_index < dataset_size:
            if next_index in dataset:
                data.append(dataset[next_index])
            next_index += 1

        return {
            'index': index,
            'data': data,
            'page_size': page_size,
            'next_index': next_index if next_index < dataset_size else None
        }
