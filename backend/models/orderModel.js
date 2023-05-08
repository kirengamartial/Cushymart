import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      status: {
        type: String,
       
      },
      message: {
        type: String,
       
      },
      data: {
        id: {
          type: String,
          
        },
        tx_ref: {
          type: String,
         
        },
        flw_ref: {
          type: String,
         
        },
        device_fingerprint: {
          type: String,
         
        },
        amount: {
          type: String,
         
        },
        currency: {
          type: String,
         
        },
        charged_amount: {
          type: String,
          
        },
        app_fee: {
          type: String,
          
        },
        merchant_fee: {
          type: String,
         
        },
        processor_response: {
          type: String,
          
        },
        auth_model: {
          type: String,
         
        },
        ip: {
          type: String,
         
        },
        narration: {
          type: String,
         
        },
        status: {
          type: String,
         
        },
        payment_type: {
          type: String,
         
        },
        created_at: {
          type: String,
         
        },
        account_id: {
          type: String,
         
        },
        meta: {
          __CheckoutInitAddress: {
            type: String,
           
          }
        },
        amount_settled: {
          type: String,
         
        },
        customer: {
          id: {
            type: String,
           
          },
          name: {
            type: String,
           
          },
          phone_number: {
            type: String,
            
          },
          email: {
            type: String,
           
          },
          created_at: {
            type: String,
           
          }
        }
      }
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order;
