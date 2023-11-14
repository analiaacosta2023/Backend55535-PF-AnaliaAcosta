import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    req.logger.fatal('Fatal error')
    req.logger.error('Error')
    req.logger.warning('Advertencia')
    req.logger.info('Info')
    req.logger.http('http')
    req.logger.debug('debug')
    res.send({ status: 'success', message: 'Esto es un test de loggers' });
})

export default router;