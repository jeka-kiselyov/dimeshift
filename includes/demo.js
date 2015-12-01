var sequelize = require('sequelize');

exports.fillDemoAccount = function(user, callback) {
	return new sequelize.Promise(function(resolve, reject) {
		var rand = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

		var currency = 'USD';

		var wallet_1_name = 'Sample Cash Wallet';
		var wallet_2_name = 'Sample Bank Account Wallet';

		var initial_1_description = 'Profit';
		var initial_2_description = 'My freelance work';

		var initial_1_amount = 4000 + rand(0, 50) * 100;
		var initial_2_amount = 3000 + rand(0, 50) * 100;

		var now = Date.now() / 1000 | 0;

		var descriptions_1 = [
			'Vodka',
			'Beer',
			'Candies',
			'Date with Sammy',
			'Sausages',
			'Food',
			'Foods',
			'Eat out',
			'Mall',
			'Cinema',
			'Gas',
			'Wi-Fi access',
			'Wi-Fi',
			'Wine'
		];

		var descriptions_2 = [
			'Hosting',
			'Custom Software',
			'Amazon S3',
			'Amazon AWS',
			'Wordpress template',
			'Translations',
			'Data Gathering',
			'CSS work',
			'Adwords',
			'PPC Campaign',
			'PPM Campaign',
			'Content writing',
			'iStock',
			'Shutterstock',
			'Gettyimages',
			'Photobank'
		];

		var t_to_add_1 = [];
		var total_1 = initial_1_amount;

		t_to_add_1.push({
			amount: initial_1_amount,
			description: initial_1_description,
			datetime: now - 70 * 24 * 60 * 60
		});
		for (var i = 29; i > 0; i--) {
			var amount = rand(0, (initial_1_amount / 30)) + (rand(0, 100) * 0.01);
			var description = descriptions_1[Math.floor(Math.random() * descriptions_1.length)];
			var datetime = now - ((i - rand(0, 80) * 0.01) * 24 * 60 * 60);

			total_1 = total_1 - amount;

			t_to_add_1.push({
				amount: -amount,
				description: description,
				datetime: datetime
			});

			if (total_1 < 300) {
				var amount = rand(100, 1000);
				t_to_add_1.push({
					amount: amount,
					description: initial_1_description,
					datetime: datetime + rand(10, 1000)
				});
				total_1 = total_1 + amount;
			}
		}

		var t_to_add_2 = [];
		var total_2 = initial_2_amount;

		t_to_add_2.push({
			amount: initial_2_amount,
			description: initial_2_description,
			datetime: now - 50 * 24 * 60 * 60
		});
		for (var i = 19; i > 0; i--) {
			var amount = rand(10, 11 + (initial_2_amount / 20));
			var description = descriptions_2[Math.floor(Math.random() * descriptions_2.length)];
			var datetime = now - ((i - rand(0, 80) * 0.01) * 24 * 60 * 60);

			if (rand(0, 5) === 1)
				amount = amount - 0.01;

			total_2 = total_2 - amount;

			t_to_add_2.push({
				amount: -amount,
				description: description,
				datetime: datetime
			});

			if (total_2 < 1000) {
				var amount = rand(1, 10) * 100;
				t_to_add_2.push({
					amount: amount,
					description: initial_2_description,
					datetime: datetime + rand(10, 1000)
				});
				total_2 = total_2 + amount;
			}
		}

		sequelize.Promise.map([wallet_1_name, wallet_2_name], function(name) {
			return user.createWallet({
				name: name,
				currency: currency
			});
		}).spread(function(wallet_1, wallet_2) {

			/// @todo: do with raw query. Too slow now.
			sequelize.Promise.map(t_to_add_1, function(data) {
				return wallet_1.insertTransaction({
					description: data.description,
					amount: data.amount,
					datetime: data.datetime
				});
			}).then(function() {
				sequelize.Promise.map(t_to_add_2, function(data) {
					return wallet_2.insertTransaction({
						description: data.description,
						amount: data.amount,
						datetime: data.datetime
					});
				}).then(function() {
					resolve();
				});
			});
		});
	});


}