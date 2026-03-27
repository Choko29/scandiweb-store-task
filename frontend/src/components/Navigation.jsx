import { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

function Navigation() {
  const location = useLocation();
  const path = location.pathname.substring(1);
  const currentCategory = path || 'all';
  const { data } = useQuery(GET_CATEGORIES);

  const categories = useMemo(() => {
    const fetchedCategories = data?.categories ?? [];
    const hasAllCategory = fetchedCategories.some(
      (category) => category.name?.toLowerCase() === 'all'
    );

    if (hasAllCategory) {
      return fetchedCategories;
    }

    return [{ name: 'all' }, ...fetchedCategories];
  }, [data]);

  return (
    <nav className="nav-categories">
      {categories.map((category) => {
        const categoryName = category.name?.toLowerCase() || '';

        return (
          <Link
            key={categoryName}
            to={`/${categoryName}`}
            className={currentCategory === categoryName ? 'active' : ''}
            data-testid={currentCategory === categoryName ? 'active-category-link' : 'category-link'}
          >
            {category.name?.toUpperCase() || ''}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navigation;