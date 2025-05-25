// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.addColumn('produk', 'ukuran', {
//       type: Sequelize.STRING(255),
//       allowNull: false,
//       defaultValue: 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
//     });
    
//     console.log('Kolom ukuran berhasil ditambahkan ke tabel produk');
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.removeColumn('produk', 'ukuran');
//     console.log('Kolom ukuran berhasil dihapus dari tabel produk');
//   }
// };