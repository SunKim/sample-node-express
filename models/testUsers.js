module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'testUsers',
		{
			// 고유 idx
			idx: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			// 이메일
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				defaultValue: 'default@service.com',
			},
			// 패스워드
			pwd: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			// 사용자명
			userNm: {
				type: DataTypes.STRING(100),
				allowNull: false,
				defaultValue: 'default user name',
			},
			// 가입일
			joinDt: {
				type: DataTypes.DATEONLY,
				allowNull: true,
				defaultValue: DataTypes.NOW,
			},
			// 최근 접속일
			lastLoginDttm: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			// 삭제여부 (boolean = tinyint 형식)
			delYn: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			tableName: 'testUsers',
			indexes: [
				{
					unique: true,
					fields: ['email'],
				},
				{
					unique: false,
					fields: ['userNm'],
				},
				{
					unique: false,
					fields: ['joinDt'],
				},
				{
					unique: false,
					fields: ['lastLoginDttm'],
				},
			],
			// cf) https://stackoverflow.com/questions/21114499/how-to-make-sequelize-use-singular-table-names
			// disable the modification of tablenames; By default, sequelize will automatically
			// transform all passed model names (first parameter of define) into plural.
			// if you don't want that, set the following
			freezeTableName: true,

			// cf) https://stackoverflow.com/questions/39587767/disable-updatedat-update-date-field-in-sequelize-js
			// 자동 createdAt 생성 방지.
			// createdAt: false,
			// updatedAt: false,
		},
	)
}
