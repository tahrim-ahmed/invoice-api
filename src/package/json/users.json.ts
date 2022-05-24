import { RoleName } from '../enum/role-name.enum';
import { Payment } from '../enum/payment.enum';

export const usersObject = [
  {
    firstName: 'Ashik',
    lastName: 'Chin2',
    email: 'admin@shakotracker.com',
    phone: '01717150423',
    password: 'admin01',
    role: RoleName.ADMIN_ROLE,
    payment: Payment.Paid,
  },
  {
    firstName: 'Tahrim',
    lastName: 'Ahmed Miad',
    email: 'tamiad1618@gmail.com',
    phone: '01733781618',
    password: 'miad1234',
    role: RoleName.ADMIN_ROLE,
    payment: Payment.Paid,
  },
  {
    firstName: 'Tahrim',
    lastName: 'Ahmed Miad',
    email: 'pranhinmiad@gmail.com',
    phone: '01551810867',
    password: 'miad1234',
    role: RoleName.USER_ROLE,
    payment: Payment.Paid,
  },
];
