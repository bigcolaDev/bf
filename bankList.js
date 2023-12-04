
const bankList = [
	{
		code: "",
		name: "wallet",
		shortname: "wallet",
		shortnameTh: "wallet",
		shortnameEn: "wallet",
		longName: "wallet",
		initials: "wallet",
		isDisabled: false,
		iconUrl:
			"https://www.truemoney.com/wp-content/uploads/2020/11/logo-truemoneywallet-300x300-1.jpg",
	},
	{
		code: "006",
		name: "ธนาคารกรุงไทย จำกัด (มหาชน) (KTB)",
		shortname: "กรุงไทย",
		shortnameTh: "กรุงไทย",
		shortnameEn: "Krungthai",
		longName: "ธนาคารกรุงไทย",
		initials: "KTB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/006v202208021500.png",
	},
	{
		code: "004",
		name: "ธนาคารกสิกรไทย จำกัด (มหาชน) (KBANK)",
		shortname: "กสิกรไทย",
		shortnameTh: "กสิกรไทย",
		shortnameEn: "Kasikorn",
		longName: "ธนาคารกสิกรไทย",
		initials: "KBANK",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/004v201910242016.png",
	},
	{
		code: "014",
		name: "ธนาคารไทยพาณิชย์ จำกัด (มหาชน) (SCB)",
		shortname: "ไทยพาณิชย์",
		shortnameTh: "ไทยพาณิชย์",
		shortnameEn: "SCB",
		longName: "ธนาคารไทยพาณิชย์",
		initials: "SCB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/014v201910242016.png",
	},
	{
		code: "002",
		name: "ธนาคารกรุงเทพ จำกัด (มหาชน) (BBL)",
		shortname: "กรุงเทพ",
		shortnameTh: "กรุงเทพ",
		shortnameEn: "Bangkok Bank",
		longName: "ธนาคารกรุงเทพ",
		initials: "BBL",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/002v201910242016.png",
	},
	{
		code: "030",
		name: "ธนาคารออมสิน (GSB)",
		shortname: "ออมสิน",
		shortnameTh: "ออมสิน",
		shortnameEn: "GSB",
		longName: "ธนาคารออมสิน",
		initials: "GSB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/030v201910242016.png",
	},
	{
		code: "011",
		name: "บริษัท ธนาคารทหารไทยธนชาต จำกัด (มหาชน) (ttb)",
		shortname: "ทีเอ็มบีธนชาต",
		shortnameTh: "ทีเอ็มบีธนชาต",
		shortnameEn: "TMBThanachart",
		longName: "ธนาคารทหารไทยธนชาต",
		initials: "ttb",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/011v202106011850.png",
	},
	{
		code: "025",
		name: "ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน) (BAY)",
		shortname: "กรุงศรี",
		shortnameTh: "กรุงศรี",
		shortnameEn: "Krungsri",
		longName: "ธนาคารกรุงศรีอยุธยา",
		initials: "BAY",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/025v201910242016.png",
	},
	{
		code: "034",
		name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร(BAAC)",
		shortname: "ธ.ก.ส.",
		shortnameTh: "ธ.ก.ส.",
		shortnameEn: "BAAC",
		longName: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
		initials: "BAAC",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/034v201910242016.png",
	},
	{
		code: "024",
		name: "ธนาคารยูโอบี จำกัด (มหาชน)(UOBT)",
		shortname: "ยูโอบี",
		shortnameTh: "ยูโอบี",
		shortnameEn: "UOB",
		longName: "ธนาคารยูโอบี",
		initials: "UOBT",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/024v202008252016.png",
	},
	{
		code: "033",
		name: "ธนาคารอาคารสงเคราะห์ (GHB)",
		shortname: "ธ.อ.ส.",
		shortnameTh: "ธ.อ.ส.",
		shortnameEn: "GHB",
		longName: "ธนาคารอาคารสงเคราะห์",
		initials: "GHB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/033v201910242016.png",
	},
	{
		code: "022",
		name: "ธนาคาร ซีไอเอ็มบี ไทย จำกัด (มหาชน) (CIMBT)",
		shortname: "ซีไอเอ็มบี",
		shortnameTh: "ซีไอเอ็มบี",
		shortnameEn: "CIMB",
		longName: "ธนาคารซีไอเอ็มบีไทย",
		initials: "CIMBT",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/022v201910242016.png",
	},
	{
		code: "073",
		name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ เพื่อรายย่อย จำกัด (มหาชน) (LHB)",
		shortname: "แลนด์ แอนด์ เฮ้าส์",
		shortnameTh: "แลนด์ แอนด์ เฮ้าส์",
		shortnameEn: "LH Bank",
		longName: "ธนาคารแลนด์ แอนด์ เฮ้าส์",
		initials: "LHB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/073v202008252016.png",
	},
	{
		code: "069",
		name: "ธนาคารเกียรตินาคินภัทร จำกัด (มหาชน) (KKP)",
		shortname: "เกียรตินาคินภัทร",
		shortnameTh: "เกียรตินาคินภัทร",
		shortnameEn: "Kiatnakin Phatra",
		longName: "ธนาคารเกียรตินาคินภัทร",
		initials: "KKP",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/069v202008272016.png",
	},
	{
		code: "067",
		name: "ธนาคารทิสโก้ จำกัด (มหาชน) (TISCO)",
		shortname: "ทิสโก้",
		shortnameTh: "ทิสโก้",
		shortnameEn: "TISCO",
		longName: "ธนาคารทิสโก้",
		initials: "TISCO",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/067v201910242016.png",
	},
	{
		code: "066",
		name: "ธนาคารอิสลามแห่งประเทศไทย (ISBT)",
		shortname: "อิสลาม",
		shortnameTh: "อิสลาม",
		shortnameEn: "Isalamic",
		longName: "ธนาคารอิสลามแห่งประเทศไทย",
		initials: "ISBT",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/066v201910242016.png",
	},
	{
		code: "070",
		name: "ธนาคารไอซีบีซี (ไทย) จำกัด (มหาชน) (ICBC)",
		shortname: "ไอซีบีซี (ไทย)",
		shortnameTh: "ไอซีบีซี (ไทย)",
		shortnameEn: "ICBC (Thai)",
		longName: "ธนาคารไอซีบีซี (ไทย)",
		initials: "ICBCT",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/070v201910242016.png",
	},
	{
		code: "071",
		name: "ธนาคารไทยเครดิต เพื่อรายย่อย จำกัด (มหาชน)(TCRB)",
		shortname: "ไทยเครดิต",
		shortnameTh: "ไทยเครดิต",
		shortnameEn: "Thai Credit",
		longName: "ธนาคารไทยเครดิต",
		initials: "TCR",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/071v201910242016.png",
	},
	{
		code: "017",
		name: "ธนาคารซิตี้แบงก์ (CITI)",
		shortname: "ซิตี้แบงก์",
		shortnameTh: "ซิตี้แบงก์",
		shortnameEn: "Citibank",
		longName: "ธนาคารซิตี้แบงก์",
		initials: "CITI",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/017v201910242016.png",
	},
	{
		code: "031",
		name: "ธนาคารฮ่องกงและเซี่ยงไฮ้ จำกัด (HSBC)",
		shortname: "เอชเอสบีซี",
		shortnameTh: "เอชเอสบีซี",
		shortnameEn: "HSBC",
		longName: "ธนาคารเอชเอสบีซี",
		initials: "HSBC",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/031v201910242016.png",
	},
	{
		code: "020",
		name: "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน) (SCBT)",
		shortname: "สแตนดาร์ดชาร์เตอร์ด",
		shortnameTh: "สแตนดาร์ดชาร์เตอร์ด",
		shortnameEn: "Standard Chartered",
		longName: "ธนาคารสแตนดาร์ดชาร์เตอร์ด",
		initials: "SCBT",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/020v201910242016.png",
	},
	{
		code: "018",
		name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น (SMBC)",
		shortname: "ซูมิโตโม มิตซุย",
		shortnameTh: "ซูมิโตโม มิตซุย",
		shortnameEn: "Sumitomo Mitsui",
		longName: "ธนาคารซูมิโตโม มิตซุย",
		initials: "SMBC",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/018v202008252016.png",
	},
	{
		code: "039",
		name: "ธนาคารมิซูโฮ คอร์ปอเรท แบงค์ (Mizuho Bank)",
		shortname: "มิซูโฮ",
		shortnameTh: "มิซูโฮ",
		shortnameEn: "Mizuho",
		longName: "ธนาคารมิซูโฮ",
		initials: "MIZUHO",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/039v201910242016.png",
	},
	{
		code: "032",
		name: "ธนาคารดอยช์แบงก์ เอจี (DB)",
		shortname: "ดอยซ์แบงก์",
		shortnameTh: "ดอยซ์แบงก์",
		shortnameEn: "Deutsche Bank",
		longName: "ธนาคารดอยซ์แบงก์",
		initials: "DB",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/032v202008252016.png",
	},
	{
		code: "079",
		name: "ธนาคารเอเอ็นแซด (ไทย) จำกัด (มหาชน) (ANZ)",
		shortname: "เอเอ็นแซ็ดไทย",
		shortnameTh: "เอเอ็นแซ็ดไทย",
		shortnameEn: "ANZ Bank (Thai)",
		longName: "ธนาคารเอเอ็นแซ็ดไทย",
		initials: "ANZ",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/079v202008252016.png",
	},
	{
		code: "052",
		name: "ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน) (BOC)",
		shortname: "ธนาคารแห่งประเทศจีน (ไทย)",
		shortnameTh: "ธนาคารแห่งประเทศจีน (ไทย)",
		shortnameEn: "Bank of China (Thai)",
		longName: "ธนาคารแห่งประเทศจีน (ไทย)",
		initials: "BOC",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/052v202009241030.png",
	},
	{
		code: "029",
		name: "ธนาคาร อินเดียนโอเวอร์ซีส์",
		shortname: "ธนาคาร อินเดียนโอเวอร์ซีส์",
		shortnameTh: "ธนาคาร อินเดียนโอเวอร์ซีส์",
		shortnameEn: "INDIAN OVERSEAS BANK",
		longName: "ธนาคาร อินเดียนโอเวอร์ซีส์",
		initials: "IOBA",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/029v202103121530.png",
	},
	{
		code: "045",
		name: "ธนาคาร บีเอ็นพี พารีบาส์",
		shortname: "ธนาคาร บีเอ็นพี พารีบาส์",
		shortnameTh: "ธนาคาร บีเอ็นพี พารีบาส์",
		shortnameEn: "BNP PARIBAS, BANGKOK BRANCH",
		longName: "ธนาคาร บีเอ็นพี พารีบาส์",
		initials: "BNPP",
		isDisabled: false,
		iconUrl:
			"https://storage.googleapis.com/next-static-content-bucket/images/transfer/banks/045v201910242016.png",
	},
];

export default bankList;
