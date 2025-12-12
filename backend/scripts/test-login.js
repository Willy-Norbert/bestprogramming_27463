import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/login';

const credentials = [
  { username: 'admin', password: 'Admin123', role: 'Admin' },
  { username: 'teacher', password: 'Staff123', role: 'Staff' },
  { username: 'student1', password: 'Student123', role: 'Student' },
  { username: 'student2', password: 'Student123', role: 'Student' },
];

async function testLogins() {
  console.log('Testing login credentials...\n');
  
  for (const cred of credentials) {
    try {
      const res = await axios.post(API_URL, {
        username: cred.username,
        password: cred.password,
      }, {
        validateStatus: () => true,
      });
      
      if (res.status === 200) {
        console.log(`✓ ${cred.role} (${cred.username}): SUCCESS`);
      } else {
        console.log(`✗ ${cred.role} (${cred.username}): FAILED - ${res.status} ${res.data?.message || ''}`);
      }
    } catch (error) {
      console.log(`✗ ${cred.role} (${cred.username}): ERROR - ${error.message}`);
    }
  }
  
  console.log('\n✅ All credentials tested!');
}

testLogins();

