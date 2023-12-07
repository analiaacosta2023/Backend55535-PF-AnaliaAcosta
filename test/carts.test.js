import supertest from 'supertest';
import chai from 'chai'

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

let cart;
const newProducts = [{ product: '64f6508cfe5c0b9e6ec4c424', quantity: 3 }]
const pid = '64f6508cfe5c0b9e6ec4c424'
const newQuantity = {quantity: 5}
const mockUser = {
    email: 'manola36@mail.com',
    password: 'abc123'
}
let cookie

describe('Testing Router Carts', () => {
    describe('Test de carts', () => {
        before(async function(){
            const response = await requester.post('/api/sessions/login').send(mockUser)
            const cookieResult = response.headers['set-cookie'][0]
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
        })
        it('El endpoint POST /api/carts/ debe crear un carrito vacio correctamente', async function () {
            const response = await requester.post('/api/carts/')
            cart = response.body.payload
            expect(response.status).to.equal(200);
            expect(cart).to.have.property('products')
        }).timeout(50000)
        it('El endpoint GET /api/carts/:cid debe obtener un carrito correctamente', async function () {
            const response = await requester.get(`/api/carts/${cart._id}`)
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.deep.equal(cart)
        }).timeout(5000)
        it('El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto a un carrito correctamente', async function () {
            const response = await requester.post(`/api/carts/${cart._id}/product/${pid}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.status).to.equal(200);
            expect(response.body.payload.products).to.have.lengthOf(1)
        }).timeout(5000)
        it('El endpoint PUT /api/carts/:cid debe actualizar los productos de un carrito correctamente', async function () {
            const response = await requester.put(`/api/carts/${cart._id}`)
                .send(newProducts)
            expect(response.status).to.equal(200);
            expect(response.body.payload.products).to.have.lengthOf(1)
        }).timeout(5000)
        it('El endpoint PUT /api/carts/:cid/product/:pid debe modificar la cantidad de un producto en un carrito correctamente', async function () {
            const response = await requester.put(`/api/carts/${cart._id}/product/${pid}`)
                .send(newQuantity)
            expect(response.status).to.equal(200);
        }).timeout(5000)
        it('El endpoint DELETE /api/carts/:cid/product/:pid debe eliminar un producto de un carrito correctamente', async function () {
            const response = await requester.delete(`/api/carts/${cart._id}/product/${pid}`)
            expect(response.status).to.equal(200);
            expect(response.body.payload.products).to.not.include({ _id: pid })
        }).timeout(5000)
        it('El endpoint DELETE /api/carts/:cid debe borrar todos los productos de un carrito correctamente', async function () {
            const response = await requester.put(`/api/carts/${cart._id}`)
                .send(newProducts)
            expect(response.status).to.equal(200);
            const response2 = await requester.delete(`/api/carts/${cart._id}`)
            expect(response2.status).to.equal(200);
            expect(response2.body.payload.products).to.be.an('array').that.is.empty;
        }).timeout(5000)
    })
})