interface Category {
  id: number;
  name: string;
}

interface ImageItem {
  breeds: unknown[];
  categories: Category[];
  id: string;
  url: string;
  width: number;
  height: number;
}
