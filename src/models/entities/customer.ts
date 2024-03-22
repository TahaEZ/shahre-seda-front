type Customer =
    | {
          id: string
          type: 'individual'
          firstName: string
          lastName: string
          nationalIdNumber: string
          phoneNumber: string
          createdAt: string
      }
    | {
          id: string
          type: 'legal'
          companyName: string
          representitive: {
              firstName: string
              lastName: string
          }
          phoneNumber: string
          createdAt: string
      }

export default Customer
