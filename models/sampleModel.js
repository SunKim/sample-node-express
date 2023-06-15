module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'sampleModel',
		{
			// 고유 idx
			idx: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			// 샘플 ENUM
			smplEnum: {
				type: DataTypes.ENUM('VAL1', 'VAL2', 'VAL3'),
				allowNull: false,
				defaultValue: 'VAL1',
			},
			// string 샘플 (db varchar2형식)
			smplStr: {
				type: DataTypes.STRING(40),
				allowNull: false,
				defaultValue: 'default event',
			},
			// text 샘플 (db text 형식)
			smplTxt: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			// date 샘플 (datetime 형식). timestamp가 date time 형태로 입력됨. default를 now() = current timestamp로.
			smplAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			// date 샘플 (date 형식). timestamp가 date 형태로 입력됨.
			smplDt: {
				type: DataTypes.DATEONLY,
				allowNull: true,
				defaultValue: null,
			},
			// 샘플 Foreign key
			smplForeignKey: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			// 샘플 Decimal (decimal 형식)
			smplRate: {
				type: DataTypes.DECIMAL(5, 2),
				allowNull: true,
			},
			// 삭제여부 (boolean = tinyint 형식)
			delYn: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			tableName: 'sampleModel',
			indexes: [
				{
					unique: false,
					fields: ['smplForeignKey'],
				},
				{
					unique: false,
					fields: ['delYn'],
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
