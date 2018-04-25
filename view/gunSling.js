var gun = Gun()

var alice = gun.get('alice').put({name: 'alice', age: 22})
var bob = gun.get('bob').put({name: 'bob', age:24})
var carl = gun.get('carl').put({name: 'carl', age: 16})
var dave = gun.get('dave').put({name: 'dave', age: 42})

var people = gun.get('people')
people.set(alice)
people.set(bob)
people.set(carl)
people.set(dave)

people.map().val(function(person) {
  console.log('The person is ', person);
})

var company = gun.get('startup').put({
  name: 'hype',
  profitable: false,
  address: {
    street: "123 Hispter Lane",
    city: "San Francisco",
    state: "CA",
    country: "USA"
  }
})

company.val(function(startup){
  console.log('The startup is', startup);
})

company.get('address').get('city').once(function(val, key){
  var value = val
  console.log(`City ${value}`);
})

gun.get('startup').put({ // or you could do `company.put({` instead.
  funded: true,
  address: {
    street: "999 Expensive Boulevard"
  }
})

var employees = company.get('employees');
employees.set(dave);
employees.set(alice);
employees.set(bob);

alice.get('spouse').put(bob);
bob.get('spouse').put(alice);

alice.get('spouse').get('employer').put(company);
alice.get('employer').put(company);

dave.get('kids').set(carl);
carl.get('dad').put(dave);

carl.get('friends').set(alice);
carl.get('friends').set(bob);
