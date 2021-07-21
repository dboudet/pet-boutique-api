const admin = require('firebase-admin')
const credentials = require('../credentials.json')

function connectDb() {
    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(credentials)
        })
    }
    return admin.firestore()
}

exports.addPet = (req,res) => {
    if(!req.body) {
        res.status(401).send('Invalid Request')
        return
    }
    const db = connectDb()
    db.collection('pets').add(req.body)
        .then( () => res.status(201).send({message: 'New pet added'}))
        .catch(err => res.status(500).send(err))
}

exports.getPets = (req,res) => { 
    const db = connectDb()
    db.collection('pets').get()
        .then(petsCollection => {
            let petsList = petsCollection.docs.map(doc => {
                let pet = doc.data()
                pet.id = doc.id
                return pet
            })
            res.send(petsList)
        })
        .catch(err => res.status(500).send(err))
}