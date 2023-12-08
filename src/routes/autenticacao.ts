import { Router } from 'express';
import { AutenticacaoController } from '../controllers/AutenticacaoController';

let router: Router = Router();

let autenticacaoController: AutenticacaoController = new AutenticacaoController();

router.post('/login', autenticacaoController.login);

export default router;
