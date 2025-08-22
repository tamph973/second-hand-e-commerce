import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';

export default [
	js.configs.recommended, // Áp dụng cấu hình 'eslint:recommended', bao gồm các quy tắc cơ bản để đảm bảo mã sạch và tuân thủ chuẩn.

	{
		files: ['**/*.js'], // Cấu hình này áp dụng cho tất cả các file JavaScript (.js)
		languageOptions: {
			ecmaVersion: 'latest', // Sử dụng phiên bản ECMAScript mới nhất (có thể là ES2023, ES2024, v.v.)
			sourceType: 'module', // Sử dụng module (import/export) thay vì script.
			parser: babelParser, // Dùng Babel để phân tích cú pháp, hỗ trợ tính năng mới của JavaScript.
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				requireConfigFile: false,
				allowImportExportEverywhere: true,
			},
			globals: {
				myCustomGlobal: 'readonly', // Khai báo myCustomGlobal là biến toàn cục chỉ có thể đọc.
				myGlobalVar: 'writable', // Khai báo myGlobalVar là biến toàn cục có thể đọc và ghi.
			},
		},
		rules: {
			'no-unused-vars': 0, // Tắt cảnh báo về các biến không sử dụng, vì có thể bạn muốn giữ chúng cho mục đích tương lai.
			'no-undef': 0, // Tắt cảnh báo nếu một biến chưa được khai báo (do đã khai báo globals).
			'no-console': 0, // Tắt cảnh báo về việc sử dụng console.log(), vì bạn có thể muốn log thông tin trong quá trình phát triển.
			'no-extra-boolean-cast': 0, // Tắt cảnh báo khi có phép chuyển đổi boolean không cần thiết, ví dụ: !!x, vì đôi khi bạn có thể sử dụng kiểu này có chủ đích.
			'no-lonely-if': 1, // Cảnh báo nếu có câu lệnh if đơn độc mà không có câu lệnh else. Điều này giúp mã rõ ràng hơn.
			'no-trailing-spaces': 1, // Cảnh báo nếu có khoảng trắng thừa ở cuối dòng.
			'no-multi-spaces': 1, // Cảnh báo nếu có nhiều khoảng trắng thừa trong mã, ví dụ: `a    + b`.
			'no-multiple-empty-lines': 1, // Cảnh báo nếu có nhiều dòng trống liên tiếp, giúp mã sạch và dễ đọc hơn.
			'space-before-blocks': ['error', 'always'], // Yêu cầu có khoảng trắng trước các khối mã (như if, for, function).
			'object-curly-spacing': [1, 'always'], // Cảnh báo nếu không có khoảng trắng trong hoặc sau dấu ngoặc nhọn của object literals.
			indent: ['off', 4], // Cảnh báo nếu thụt lề không đúng (4 khoảng trắng).
			semi: [1, 'always'], // Cảnh báo nếu thiếu dấu chấm phẩy (chấm phẩy luôn luôn được yêu cầu).
			quotes: ['error', 'single'], // Yêu cầu sử dụng dấu nháy đơn thay vì nháy kép cho chuỗi (strings).
			'array-bracket-spacing': 1, // Cảnh báo nếu có thiếu khoảng trắng trong các dấu ngoặc vuông của mảng.
			'linebreak-style': 0, // Tắt cảnh báo về kiểu ngắt dòng (LF/CRLF), vì nó có thể phụ thuộc vào hệ điều hành.
			'no-unexpected-multiline': 'warn', // Cảnh báo khi gặp lỗi cú pháp do dòng mã có thể bị hiểu sai vì thiếu dấu chấm phẩy (như trường hợp với return).
			'keyword-spacing': 1, // Cảnh báo nếu thiếu khoảng trắng xung quanh các từ khóa như if, for, while, v.v.
			'comma-dangle': 0, // Cảnh báo nếu thiếu dấu phẩy sau phần tử cuối cùng trong mảng hoặc object.
			'comma-spacing': 1, // Cảnh báo nếu không có khoảng trắng hợp lý sau dấu phẩy.
			'arrow-spacing': 1, // Cảnh báo nếu không có khoảng trắng hợp lý xung quanh dấu mũi tên trong các function arrow (=>).
		},
	},
];
