import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import type { Product, PaginationResponse } from '../types';
import ErrorBoundary from './ErrorBoundary'; // Import the error boundary

const useFetchProducts = (page: number, rowsPerPage: number, search: string, filter: { minPrice: string; maxPrice: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        // Introduce a delay of 500ms before fetching
        await new Promise(resolve => setTimeout(resolve, 500));

        const params = {
          page: page + 1,
          limit: rowsPerPage,
          q: search.trim() || undefined,
          minPrice: filter.minPrice ? parseFloat(filter.minPrice) : undefined,
          maxPrice: filter.maxPrice ? parseFloat(filter.maxPrice) : undefined,
        };

        const response = await axios.get<PaginationResponse>('http://localhost:3000/api/products/filter', {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setProducts(response.data.products || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } catch (err) {
        setError(err instanceof AxiosError ? err.message : 'Failed to fetch products');
        setProducts([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, rowsPerPage, search, filter]);

  return { products, loading, error, totalItems };
};

const ProductList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ minPrice: '', maxPrice: '' });

  const { products, loading, error, totalItems } = useFetchProducts(page, rowsPerPage, search, filter);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0); // Reset to the first page when searching
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const applyFilters = () => {
    setPage(0); // Reset to the first page when applying filters
  };

  const formatPrice = (price: number | undefined | null | string) => {
    if (price === null || price === undefined) return '$0.00'; // Fallback for null/undefined
    const numPrice = typeof price === 'number' ? price : parseFloat(price.toString()) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <ErrorBoundary>
      <Paper sx={{ p: 3, maxWidth: 'fit-content', margin: '20px auto', borderRadius: 2, boxShadow: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', backgroundColor: '#e3f2fd', p: 2, borderRadius: 1 }}
        >
          Product List
        </Typography>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <TextField
            label="Search by Name"
            value={search}
            onChange={handleSearch}
            size="small"
            variant="outlined"
            sx={{ minWidth: '200px', backgroundColor: '#f5f5f5' }}
          />
          <TextField
            label="Min Price"
            name="minPrice"
            value={filter.minPrice}
            onChange={handleFilterChange}
            type="number"
            size="small"
            variant="outlined"
            sx={{ minWidth: '150px', backgroundColor: '#f5f5f5' }}
          />
          <TextField
            label="Max Price"
            name="maxPrice"
            value={filter.maxPrice}
            onChange={handleFilterChange}
            type="number"
            size="small"
            variant="outlined"
            sx={{ minWidth: '150px', backgroundColor: '#f5f5f5' }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={applyFilters}
            sx={{ height: 'fit-content' }}
          >
            Filter
          </Button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4, p: 2, backgroundColor: '#ffebee' }}>
            {error}
          </Typography>
        ) : products.length === 0 ? (
          <Typography align="center" sx={{ mt: 4, p: 2, color: '#666', backgroundColor: '#f5f5f5' }}>
            No products found.
          </Typography>
        ) : (
          <>
            <Table 
              sx={{ 
                mt: 2, 
                border: '1px solid #ddd', 
                width: '600px', // Set a fixed width
                tableLayout: 'fixed', // Ensure fixed layout
              }}
            >
              <TableHead sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff', minWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff', minWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff', minWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{ '&:hover': { backgroundColor: '#e3f2fd' }, borderBottom: '1px solid #eee' }}
                  >
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name || 'N/A'}</TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatPrice(product.price)}</TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.quantity || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ mt: 2, color: '#1976d2', '& .MuiTablePagination-selectLabel': { color: '#1976d2' } }}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Items per page"
            />
          </>
        )}
      </Paper>
    </ErrorBoundary>
  );
};

export default ProductList;
