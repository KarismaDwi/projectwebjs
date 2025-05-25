const Payment = require('../models/paymentModels');
const Checkout = require('../models/checkoutModels');
const Produk = require('../models/produkModels');

// Ambil payment by checkout_id & tampilkan detail checkout+produk
const getPaymentByCheckoutId = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { checkout_id: req.params.checkout_id },
      include: [
        {
          model: Checkout,
          as: 'checkout',
          attributes: [
            'id',
            'user_id',
            'id_produk',
            'receiver_name',
            'phone',
            'address',
            'payment_method',
            'payer_name',
            'delivery_date',
            'delivery_time',
            'shipping_method',
            'shipping_cost',
            'total_amount',
            'status',
            'created_at'
          ],
          include: [
            {
              model: Produk,
              as: 'produk',
              attributes: ['name', 'harga', 'gambar']
            }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    const checkout = payment.checkout;
    const produk = checkout ? checkout.produk : null;

    res.status(200).json({
      success: true,
      data: {
        id: payment.id,
        checkout_id: payment.checkout_id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        transaction_id: payment.transaction_id,
        proof_url: payment.proof_url,
        created_at: payment.createdAt,
        checkout: checkout ? { ...checkout.toJSON(), produk } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

module.exports = {
  getPaymentByCheckoutId,
  // tambahkan createPayment dan updatePaymentStatus jika perlu
};