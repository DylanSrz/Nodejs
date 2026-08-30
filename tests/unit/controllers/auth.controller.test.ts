import { jest } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    loginController,
    meController,
} from '../../../src/controllers/auth.controller.js';
import User from '../../../src/models/user.model.js';
import Roles from '../../../src/models/role.model.js';
import {
    mockRequest,
    mockResponse,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const SECRETO = 'secreto-solo-para-pruebas';
const PASSWORD = 'claveCorrecta123';

// Hash real, no un doble: así se comprueba de verdad que
// bcrypt.compare acepta la contraseña buena y rechaza la mala.
// Cuatro rondas en vez de diez, solo para que la suite sea ágil.
let hash: string;

beforeAll(async () => {
    hash = await bcrypt.hash(PASSWORD, 4);
});


const usuarioActivo = () => ({
    id: 'u1',
    email: 'admin@correo.com',
    password_hash: hash,
    is_active: true,
    role_id: 'r1',
});


describe('loginController', () => {

    const originalSecret = process.env.JWT_SECRET;

    beforeEach(() => {
        process.env.JWT_SECRET = SECRETO;
    });

    afterAll(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    });


    it('responde 201 con el token cuando las credenciales son correctas', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        expect(statusOf(res)).toBe(201);
        expect(bodyOf(res).message).toBe('Login exitoso.');
        expect(typeof bodyOf(res).token).toBe('string');
    });


    it('firma el token con el id y el rol del usuario', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        const payload = jwt.verify(bodyOf(res).token, SECRETO) as jwt.JwtPayload;

        expect(payload.id).toBe('u1');
        expect(payload.role).toBe('admin');
    });


    it('da al token una hora de vigencia', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        const payload = jwt.verify(bodyOf(res).token, SECRETO) as jwt.JwtPayload;

        expect(payload.exp! - payload.iat!).toBe(3600);
    });


    it('busca el correo en minúsculas, como lo guarda el modelo', async () => {

        const findOne = jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        await loginController(
            mockRequest({ body: { email: 'ADMIN@Correo.COM', password: PASSWORD } }),
            mockResponse()
        );

        expect(findOne).toHaveBeenCalledWith({ where: { email: 'admin@correo.com' } });
    });


    it('responde 403 si el correo no existe', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(null as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'nadie@correo.com', password: PASSWORD } }),
            res
        );

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('correo no existe.');
    });


    it('responde 403 si el usuario está inactivo', async () => {

        // Es el efecto del borrado lógico: la fila sigue ahí,
        // pero no puede entrar.
        jest.spyOn(User, 'findOne')
            .mockResolvedValue({ ...usuarioActivo(), is_active: false } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('El usuario está inactivo.');
    });


    it('responde 403 si la contraseña no coincide', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: 'equivocada' } }),
            res
        );

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('password no es valida.');
    });


    it('no comprueba el rol si la contraseña ya falló', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        const findByPk = jest.spyOn(Roles, 'findByPk');

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: 'equivocada' } }),
            mockResponse()
        );

        expect(findByPk).not.toHaveBeenCalled();
    });


    it('responde 403 si el rol del usuario no existe', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue(null as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('Rol no existe');
    });


    it('responde 500 si falta JWT_SECRET', async () => {

        delete process.env.JWT_SECRET;

        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        expect(statusOf(res)).toBe(500);
    });


    it('nunca devuelve el hash de la contraseña', async () => {

        jest.spyOn(User, 'findOne').mockResolvedValue(usuarioActivo() as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: 'r1', name: 'admin' } as never);

        const res = mockResponse();

        await loginController(
            mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
            res
        );

        expect(JSON.stringify(bodyOf(res))).not.toContain(hash);
    });


    it('propaga un fallo de la base de datos al manejador global', async () => {

        // El controlador ya no atrapa esto para responder 401:
        // un error de infraestructura no son credenciales malas.
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('conexión caída') as never);

        await expect(
            loginController(
                mockRequest({ body: { email: 'admin@correo.com', password: PASSWORD } }),
                mockResponse()
            )
        ).rejects.toThrow('conexión caída');
    });
});


describe('meController', () => {

    it('devuelve el perfil del usuario del token', async () => {

        jest.spyOn(User, 'findByPk')
            .mockResolvedValue({ id: 'u1', email: 'admin@correo.com' } as never);

        const res = mockResponse();

        await meController(mockRequest({ user: { id: 'u1', role: 'admin' } } as never), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).user.id).toBe('u1');
    });


    it('resuelve el usuario por el id que viaja en el token', async () => {

        const findByPk = jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 'u9' } as never);

        await meController(
            mockRequest({ user: { id: 'u9', role: 'coder' } } as never),
            mockResponse()
        );

        expect(findByPk.mock.calls[0]?.[0]).toBe('u9');
    });


    it('excluye password_hash de la consulta', async () => {

        const findByPk = jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 'u1' } as never);

        await meController(
            mockRequest({ user: { id: 'u1', role: 'admin' } } as never),
            mockResponse()
        );

        expect((findByPk.mock.calls[0]?.[1] as any).attributes)
            .toEqual({ exclude: ['password_hash'] });
    });


    it('responde 401 si no hay usuario en la petición', async () => {

        const res = mockResponse();

        await meController(mockRequest(), res);

        expect(statusOf(res)).toBe(401);
    });


    it('responde 404 si el usuario del token ya no existe', async () => {

        // Por ejemplo, si lo borraron mientras su token seguía vivo.
        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        const res = mockResponse();

        await meController(mockRequest({ user: { id: 'u1', role: 'admin' } } as never), res);

        expect(statusOf(res)).toBe(404);
    });
});
