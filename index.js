import express from 'express'
import Transaction from '../../models/Transaction.js';
import moment from 'moment'

export const Index = async (req, res) => {

    //total number of transactions
    const totalTransactionCount = await Transaction.countDocuments();
    // Serialize the array of documents to binary data
    const serializedData = Buffer.from(JSON.stringify(totalTransactionCount), 'utf-8');
    const NumberOfTransaction = JSON.parse(serializedData.toString('utf-8'));
    
    // number of payout transaction
    const  NumberOfPayoutTransactions = await Transaction.countDocuments({ transactionType: 'payout' });

     // number of error transactioon
    const  NumberOfErrorTransactions = await Transaction.countDocuments({ transactionType: 'error' });

     // number of error transactioon
     const  NumberOfEarningsTransactions = await Transaction.countDocuments({ transactionType: 'earnings' });


   // Count the number of transactions where date is equal to day
    const yesterday = moment().subtract(1, 'days').startOf('day').toISOString();
    const  NumberOfPayoutTransactionBydays= await Transaction.countDocuments({
      date: { $gte: new Date(yesterday), $lt: new Date() }, transactionType: 'payout'
    });


    // Use aggregation to find payout transactions within the date range
    const result = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: new Date(yesterday), $lt: new Date() },
          transactionType: 'payout'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: '$amount' } }
        }
      }
    ]).exec();

    // If there are results, access totalAmount from the first item
    const totalPayoutAmountByDays = result.length > 0 ? result[0].totalAmount : 0;


    const Eresult = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: new Date(yesterday), $lt: new Date() },
          transactionType: 'error'
        }
      },
      {
        $addFields: {
          amount: {
            $toDouble: {
              $replaceOne: {
                input: '$amount',
                find: ',',
                replacement: '.'
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]).exec();

    // If there are results, access totalAmount from the first item
    const totalErrorPayoutAmountByDays = Eresult.length > 0 ? Eresult[0].totalAmount : 0;



    const  ListofPayoutTransactionByDays= await Transaction.find({
      date: { $gte: new Date(yesterday), $lt: new Date() }, transactionType: 'payout'
    });

    const  ListofErrorTransactionByDays= await Transaction.find({
      date: { $gte: new Date(yesterday), $lt: new Date() }, transactionType: 'error'
    });


  
  const data = {
    "User List of transaction with error yesterday": ListofErrorTransactionByDays,
    "User List of succesful transaction yesterday": ListofPayoutTransactionByDays,
    "Life time, Total Number of Transsaction request for earnings, payout, and error": NumberOfTransaction,
    "Total number of payout transaction": NumberOfPayoutTransactions,
     "Number of transactions with error yesterday":NumberOfErrorTransactions,
     "Number of succesful transaction yesterday":NumberOfPayoutTransactionBydays,
    "Number of Earnings request": NumberOfEarningsTransactions,
    "Total amount paid yesterday without error": totalPayoutAmountByDays,
     "Total amount paid yesterday with error":totalErrorPayoutAmountByDays,
  }

  res.status(200).send({data})

}


// app.get('/transaction', async (req, res) => {
//     try {


//     const collectionName = 'transactions';

//      // Access the collection
//    const collection = client.db().collection(collectionName);

//    const today = moment().startOf('day').toISOString();
//    const yesterday = moment().subtract(1, 'days').startOf('day').toISOString();
//    const twoDaysAgo = moment().subtract(2, 'days').startOf('day').toISOString();
//    const startOfMonth = moment().startOf('month').toISOString();
 
//     // Function to get all transaction Count
//     const allTransactionCount = async (startDate, endDate) => {
//         return await  collection.countDocuments({
//          });
   
//       };
   
//         // Function to get all total Payout transaction
//         const allTransactionPayOut = async (startDate, endDate) => {
//            const result = await collection.aggregate([
//                {
//                  $match: {
//                    transactionType: 'payout'
//                  }
//                },
//                {
//                  $group: {
//                    _id: null,
//                    totalAmount: { $sum: { $toDouble: '$amount' } }
//                  }
//                }
               
//              ]).toArray();
   
//              return  result.length > 0 ? result[0].totalAmount : 0;
       
//          }
   
//         //  Function to get transaction count for a specific date range
//          const allAnalytics = async (startDate, endDate) => {
//            return await  collection.find({
              
//             },  { projection: { _id: 0, amount: 1, date: 1 } }
      
//             ).toArray();
      
//          };
      

//    // Function to get transaction count for a specific date range
//    const getTransactionCountByDateRange = async (startDate, endDate) => {
//      return await  collection.countDocuments({
//         'date.$date': { $gte: startDate, $lt: endDate},
        
//       });

//    };

//      // Function to get total Payout for a specific date range
//      const getTransactionPayoutByDateRange = async (startDate, endDate) => {
//         const result = await collection.aggregate([
//             {
//               $match: {
//                 'date.$data': { $gte:startDate, $lt: endDate },
//                 transactionType: 'payout'
//               }
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: { $toDouble: '$amount' } }
//               }
//             }
            
//           ]).toArray();

//           return  result.length > 0 ? result[0].totalAmount : 0;
    
//       }

   
//     const totalCount = await allTransactionCount();
//     const totalAmout = await allTransactionPayOut();

        
//     //Total Number Of Transaction today
//     const countToday =  await getTransactionCountByDateRange(today, moment().toISOString())

//     //Total Number Of Amount Paid today
//     const amountToday = await  getTransactionPayoutByDateRange(today, moment().toISOString())


         
//     //Total Number Of Transaction yesterday
//     const countYesterday = await  getTransactionCountByDateRange(yesterday,today,)

//     //Total Number Of Amount Paid yesterday
//     const amountYesterday = await getTransactionPayoutByDateRange(yesterday,today)



         
//     //Total Number Of Transaction 2days
//     const count2days =  await getTransactionCountByDateRange(twoDaysAgo, yesterday)

//     //Total Number Of Amount Paid 2day
//     const amount2days = await getTransactionPayoutByDateRange(twoDaysAgo, yesterday)


           
//     //Total Number Of Transaction this Month
//     const countThisMonth =  await getTransactionCountByDateRange(startOfMonth, moment().toISOString())

//     //Total Number Of Amount Paid this Month
//     const amountThisMonth = await getTransactionPayoutByDateRange(startOfMonth, moment().toISOString())

//     const pipeline = [
        
//         {
//           $group: {
//             _id: {
//                 $dateToString: {
//                   format: '%Y-%m-%d',
//                   date: { $toDate: '$date.date' }, // Convert date to Date type
//                 }
//             },
//             totalAmount: { $sum: { $toDouble: '$amount' } },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             date: '$_id',
//             totalAmount: 1,
//           },
//         },
//       ];
  
//       // Execute the aggregation pipeline
//       const result = await collection.aggregate(pipeline).toArray()


    

//     const data = {
//        amountToday,
//        countToday,
//         amountYesterday,
//         countYesterday,
//          amount2days,
//         count2days,
//         totalAmout,
//         totalCount,
//         result


//       }
//       res.json(data);

    


// } 
//  catch (error) {
//     console.error('Error fetching data from MongoDB:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
    
// });


// Start the server and listen on the specified port
