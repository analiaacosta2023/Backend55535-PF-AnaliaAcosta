import { generateProduct } from "../src/utils.js";
import supertest from 'supertest';
import chai from 'chai'

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

const pid = '64f6508cfe5c0b9e6ec4c424'
const mockUser = {
    email: 'manola36@mail.com',
    password: 'abc123'
}
let cookie

describe('Testing Router Products', () => {
    describe('Test de products', () => {
        before(async function () {
            const response = await requester.post('/api/sessions/login').send(mockUser)
            const cookieResult = response.headers['set-cookie'][0]
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
        })
        beforeEach(function () {
            this.timeout(5000)
        })
        it('El endpoint GET /api/products/ debe obtener 10 productos correctamente', async function () {
            const response = await requester.get(`/api/products`)
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.lengthOf(10)
        })
        it('El endpoint GET /api/products/:pid debe obtener un producto correctamente', async function () {
            const response = await requester.get(`/api/products/${pid}`)
            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.be.deep.equal(pid)
        })
        it('El endpoint POST /api/products/ debe crear un producto correctamente', async function () {
            const mockProduct = generateProduct();
            const response = await requester.post('/api/products/')
            .send(mockProduct)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an('object')
        })
        it('El endpoint DELETE /api/products/:pid debe borrar un producto correctamente', async function () {
            const mockProduct = generateProduct();
            const product = await requester.post('/api/products/')
            .send(mockProduct)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(product.status).to.equal(200);
                     
            const response = await requester.delete(`/api/products/${product.body.payload._id}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.status).to.equal(200);

            const response2 = await requester.get(`/api/products/${product.body.payload._id}`)
            expect(response2.status).to.equal(404);
        })
    })
})