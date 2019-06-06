
// 给 Object 添加属性
let user = { id: 100, name: 'Howard Moon'}
user = { ...user, password: 'Password!' }
console.log(user);

//  合并对象

const part1 = { id: 100, name: 'Howard Moon' }
const part2 = { id: 100, password: 'Password!' }

const user1 = { ...part1, ...part2 }
console.log(user1);


//
const noPassword = ({ password, ...rest }) => rest
const user = {
  id: 100,
  name: 'Howard Moon',
  password: 'Password!'
}

noPassword(user) //=> { id: 100, name: 'Howard moon' }


const user1 = {
    id: 100,
    name: 'Howard Moon',
    password: 'Password!'
  }
  const removeProperty = prop => ({ [prop]: _, ...rest }) => rest
  //                     ----       ------
  //                          \   /
  //                dynamic destructuring
  
  const removePassword = removeProperty('password')
  const removeId = removeProperty('id')
  
  removePassword(user1) //=> { id: 100, name: 'Howard Moon' }
  removeId(user1) //=> { name: 'Howard Moon', password: 'Password!' }


  const user3 = {
    password: 'Password!',
    name: 'Naboo',
    id: 300
  }
  
  const organize = object => ({ id: undefined, ...object })
  //                            -------------
  //                          /
  //  move id to the first property
  
  organize(user3)
  //=> { id: 300, password: 'Password!', name: 'Naboo' }


  const user3 = {
    password: 'Password!',
    name: 'Naboo',
    id: 300
  }
  
  const organize = ({ password, ...object }) =>
    ({ ...object, password })
  //              --------
  //             /
  // move password to last property
  
  organize(user3)
  
  //=> { name: 'Naboo', id: 300, password: 'Password!' }



  const user2 = {
    id: 200,
    name: 'Vince Noir'
  }
  
  const user4 = {
    id: 400,
    name: 'Bollo',
    quotes: ["I've got a bad feeling about this..."]
  }
  
  const setDefaults = ({ quotes = [], ...object}) =>
    ({ ...object, quotes })
  
  setDefaults(user2)
  //=> { id: 200, name: 'Vince Noir', quotes: [] }
  
  setDefaults(user4)
  //=> {
  //=>   id: 400,
  //=>   name: 'Bollo',
  //=>   quotes: ["I've got a bad feeling about this..."]
  //=> }