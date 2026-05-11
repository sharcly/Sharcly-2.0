
import axios from 'axios';

async function checkCategories() {
  try {
    const response = await axios.get('http://localhost:8181/api/products/categories');
    console.log(JSON.stringify(response.data.categories, null, 2));
  } catch (error) {
    console.error('Error fetching categories:', error.message);
  }
}

checkCategories();
