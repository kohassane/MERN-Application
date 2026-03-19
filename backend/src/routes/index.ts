import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import eventsRoutes from './events.routes';
import resultsRoutes from './results.routes';
import productsRoutes from './products.routes';
import partnersRoutes from './partners.routes';
import newsRoutes from './news.routes';
import ordersRoutes from './orders.routes';
import searchRoutes from './search.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/results', resultsRoutes);
router.use('/products', productsRoutes);
router.use('/partners', partnersRoutes);
router.use('/news', newsRoutes);
router.use('/orders', ordersRoutes);
router.use('/search', searchRoutes);

export default router;
