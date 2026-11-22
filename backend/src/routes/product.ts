import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getLowStockProducts 
} from '../controllers/product.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router: Router = Router();

router.get('/', getProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, adminMiddleware, upload.any(), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
