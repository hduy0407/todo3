import { expect } from "chai";
import { initializeTestDb, insertTestUSer, getToken } from "./helpers/test.js";

const base_url ='http://localhost:3001'

describe('GET tasks', () => {
    before(() => {
        initializeTestDb();
    })

    it ('should get all tasks', async() => {
        const response = await fetch(base_url + '/');
        const data = await response.json();

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
    })
})

describe('POST task', () => {
    const email = 'test@todo.com'
    const password = 'test123'
    insertTestUSer(email,password);
    const token = getToken(email);
    it ('should post a task', async() => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        });
        
        const data = await response.json();
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not post a task without description', async() => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':null})
        });
        
        const data = await response.json();
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it ('should not post a task with zero length description', async() => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':''})
        });
        
        const data = await response.json();
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE task', () => {
    const token  = getToken('test@todo.com');

    it ('should delete a task', async() => {
        const response = await fetch(base_url + '/delete/1', {
            method: 'delete',
            headers: {
                'Authorization': token
            }
        });
        
        const data = await response.json();
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not delete a task with SQL injection', async() => {
        const response = await fetch(base_url + '/delete/id=0 or id> 0', {
            method: 'delete',
            headers: {
                'Authorization': token
            }
        });
        
        const data = await response.json();
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('POST register', () => {
    const email = 'tes@todo.com'
    const password = 'test123'
    it ('should register with valid email and password', async() => {
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json();
        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')
    })

    it ('should not post a user with less than 8 character password', async() => {
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json();
        expect(response.status).to.equal(500, data.error);
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('POST login', () => {
    const email = 'test@todo.com'
    const password = 'test123'
    it ('should login with valid credentials', async() => {
        const response = await fetch(base_url + '/user/login', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json();
        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')
    })
})