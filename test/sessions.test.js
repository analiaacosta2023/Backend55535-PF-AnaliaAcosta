import supertest from 'supertest';
import chai from 'chai'

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

const newUser = {
    first_name: 'Hola',
    last_name: "Manola",
    age: 25,
    email: 'manola37@mail.com',
    password: 'abc123'
}

let cookie

describe('Testing Router Sessions', () => {
    describe('Test de sessions', () => {
        it('El endpoint POST /api/sessions/register debe crear un usuario correctamente', async function () {
            const response = await requester.post('/api/sessions/register').send(newUser)
            expect(response.status).to.equal(200);
        }).timeout(5000)
        it('El endpoint POST /api/sessions/login debe loguear al usuario y devolver una cookie', async function () {
            const response = await requester.post('/api/sessions/login').send(newUser)
            const cookieResult = response.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('coderCookie');
            expect(cookie.value).to.be.ok
        }).timeout(5000)
        it('El endpoint GET /api/sessions/current debe traer al usuario que contiene la cookie', async function () {
            const response = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.body.payload.email).to.be.eql(newUser.email);
        }).timeout(5000)
    })

})