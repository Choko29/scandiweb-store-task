import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';

function CategoryPage() {
  const { category } = useParams();
  const currentCategory = category || 'all';

  return <ProductList currentCategory={currentCategory} />;
}

export default CategoryPage;