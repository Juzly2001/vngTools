import { hsk1 } from './hsk1.js';
import { hsk2 } from './hsk2.js';
import { hsk3 } from './hsk3.js';
import { hsk4 } from './hsk4.js';
import { hsk5 } from './hsk5.js';
import { hsk6 } from './hsk6.js';
import {job} from './job.js'
import { family } from './family.js';
import { basic } from './basic.js';
import { logistics } from './logistics.js';
import { eCommerce } from './eCommerce .js';
import { technology } from './technology.js';
import { animal } from './animal.js';
import { items } from './items.js';
const fullLibrary = {
  hsk1,
  hsk2,
  hsk3,
  hsk4,
  hsk5,
  hsk6,
  job,
  family,
  basic,
  logistics,
  eCommerce,
  technology,
  animal,
  items,
  
  "cong_nghe_lap_trinh": [
    {
      "word": "电脑",
      "pinyin": "diànnǎo",
      "meaning": "máy tính",
      "example": "我在用电脑。",
      "examplePinyin": "Wǒ zài yòng diànnǎo.",
      "fromType": "Danh từ",
      "trans": "Tôi đang dùng máy tính."
    },
    {
      "word": "手机",
      "pinyin": "shǒujī",
      "meaning": "điện thoại di động",
      "example": "我的手机。",
      "examplePinyin": "Wǒ de shǒujī.",
      "fromType": "Danh từ",
      "trans": "Điện thoại của tôi."
    },
    {
      "word": "软件",
      "pinyin": "ruǎn jiàn",
      "meaning": "Phần mềm",
      "example": "我们需要安装最新版本的软件。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Chúng ta cần cài đặt phiên bản phần mềm mới nhất."
    },
    {
      "word": "硬件",
      "pinyin": "yìng jiàn",
      "meaning": "Phần cứng",
      "example": "电脑的硬件需要升级。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Phần cứng của máy tính cần phải nâng cấp."
    },
    {
      "word": "代码",
      "pinyin": "dàimǎ",
      "meaning": "mã code",
      "example": "这段代码有错误。",
      "examplePinyin": "Zhè duàn dàimǎ yǒu cuòwù.",
      "fromType": "Danh từ",
      "trans": "Đoạn code này có lỗi."
    },
    {
      "word": "程序",
      "pinyin": "chéng xù",
      "meaning": "Trình tự",
      "example": "请按照程序完成任务。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Hãy hoàn thành nhiệm vụ theo trình tự."
    },
    {
      "word": "数据库",
      "pinyin": "shùjùkù",
      "meaning": "cơ sở dữ liệu",
      "example": "数据保存在数据库里。",
      "examplePinyin": "Shùjù bǎocún zài shùjùkù lǐ.",
      "fromType": "Danh từ",
      "trans": "Dữ liệu được lưu trong cơ sở dữ liệu."
    },
    {
      "word": "服务器",
      "pinyin": "fúwùqì",
      "meaning": "máy chủ",
      "example": "服务器很稳定。",
      "examplePinyin": "Fúwùqì hěn wěndìng.",
      "fromType": "Danh từ",
      "trans": "Máy chủ rất ổn định."
    },
    {
      "word": "网页",
      "pinyin": "wǎngyè",
      "meaning": "trang web",
      "example": "这个网页打不开。",
      "examplePinyin": "Zhège wǎngyè dǎ bù kāi.",
      "fromType": "Danh từ",
      "trans": "Trang web này không mở được."
    },
    {
      "word": "账号",
      "pinyin": "zhànghào",
      "meaning": "tài khoản",
      "example": "我忘了账号。",
      "examplePinyin": "Wǒ wàng le zhànghào.",
      "fromType": "Danh từ",
      "trans": "Tôi quên tài khoản rồi."
    },
    {
      "word": "密码",
      "pinyin": "mìmǎ",
      "meaning": "mật mã",
      "example": "我把信用卡的密码忘了。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Tôi quên mất mật mã thẻ tín dụng rồi."
    },
    {
      "word": "系统",
      "pinyin": "xì tǒng",
      "meaning": "Hệ thống",
      "example": "这个系统很复杂。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Hệ thống này rất phức tạp."
    },
    {
      "word": "网络",
      "pinyin": "wǎng luò",
      "meaning": "Mạng internet",
      "example": "我每天都花几个小时上网络。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Tôi dành vài giờ mỗi ngày để lướt internet."
    },
    {
      "word": "网站",
      "pinyin": "wǎngzhàn",
      "meaning": "website",
      "example": "这个网站。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Website này."
    },
    {
      "word": "下载",
      "pinyin": "xià zǎi",
      "meaning": "Tải",
      "example": "我正在下载一个文件。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Tôi đang tải một tập tin."
    },
    {
      "word": "安装",
      "pinyin": "ān zhuāng",
      "meaning": "Lắp đặt",
      "example": "请帮我安装这台空调。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Xin hãy giúp tôi lắp đặt chiếc điều hòa này."
    },
    {
      "word": "错误",
      "pinyin": "cuòwù",
      "meaning": "sai lầm",
      "example": "谢谢你指出了我的错误。",
      "examplePinyin": "",
      "fromType": "adj./n.",
      "trans": "Cảm ơn bạn đã chỉ ra sai lầm của tôi."
    },
    {
      "word": "功能",
      "pinyin": "gōng néng",
      "meaning": "Công năng",
      "example": "这个软件的功能非常强大。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Chức năng của phần mềm này rất mạnh mẽ."
    },
    {
      "word": "工具",
      "pinyin": "gōng jù",
      "meaning": "Công cụ",
      "example": "这把工具很实用。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Công cụ này rất hữu ích."
    }
  ],
  "ai_cong_nghe_moi": [
    {
      "word": "人工智能",
      "pinyin": "réngōng zhìnéng",
      "meaning": "trí tuệ nhân tạo",
      "example": "人工智能发展很快。",
      "examplePinyin": "Réngōng zhìnéng fāzhǎn hěn kuài.",
      "fromType": "Danh từ",
      "trans": "Trí tuệ nhân tạo phát triển rất nhanh."
    },
    {
      "word": "模型",
      "pinyin": "móxíng",
      "meaning": "mô hình",
      "example": "这个模型很准确。",
      "examplePinyin": "Zhège móxíng hěn zhǔnquè.",
      "fromType": "Danh từ",
      "trans": "Mô hình này rất chính xác."
    },
    {
      "word": "算法",
      "pinyin": "suànfǎ",
      "meaning": "thuật toán",
      "example": "算法需要优化。",
      "examplePinyin": "Suànfǎ xūyào yōuhuà.",
      "fromType": "Danh từ",
      "trans": "Thuật toán cần được tối ưu."
    },
    {
      "word": "数据",
      "pinyin": "shù jù",
      "meaning": "Số liệu",
      "example": "我们需要分析这些数据。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Chúng ta cần phân tích những số liệu này."
    },
    {
      "word": "训练",
      "pinyin": "xùn liàn",
      "meaning": "Huấn luyện",
      "example": "教练正在训练队员们。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Huấn luyện viên đang huấn luyện các vận động viên."
    },
    {
      "word": "生成",
      "pinyin": "shēngchéng",
      "meaning": "tạo ra",
      "example": "软件可以生成图片。",
      "examplePinyin": "Ruǎnjiàn kěyǐ shēngchéng túpiàn.",
      "fromType": "Động từ",
      "trans": "Phần mềm có thể tạo ra hình ảnh."
    },
    {
      "word": "识别",
      "pinyin": "shíbié",
      "meaning": "nhận dạng",
      "example": "手机可以识别文字。",
      "examplePinyin": "Shǒujī kěyǐ shíbié wénzì.",
      "fromType": "Động từ",
      "trans": "Điện thoại có thể nhận dạng chữ."
    },
    {
      "word": "自动化",
      "pinyin": "zìdònghuà",
      "meaning": "tự động hóa",
      "example": "这个流程可以自动化。",
      "examplePinyin": "Zhège liúchéng kěyǐ zìdònghuà.",
      "fromType": "Danh/Động",
      "trans": "Quy trình này có thể tự động hóa."
    },
    {
      "word": "提示词",
      "pinyin": "tíshìcí",
      "meaning": "prompt, câu lệnh gợi ý",
      "example": "好的提示词很重要。",
      "examplePinyin": "Hǎo de tíshìcí hěn zhòngyào.",
      "fromType": "Danh từ",
      "trans": "Prompt tốt rất quan trọng."
    },
    {
      "word": "机器人",
      "pinyin": "jīqìrén",
      "meaning": "robot",
      "example": "机器人可以帮助人类。",
      "examplePinyin": "Jīqìrén kěyǐ bāngzhù rénlèi.",
      "fromType": "Danh từ",
      "trans": "Robot có thể giúp con người."
    },
    {
      "word": "学习",
      "pinyin": "xuéxí",
      "meaning": "học tập",
      "example": "学习很努力。",
      "examplePinyin": "Xuéxí hěn nǔlì.",
      "fromType": "Động từ",
      "trans": "Học tập rất nỗ lực."
    },
    {
      "word": "语言",
      "pinyin": "yǔyán",
      "meaning": "ngôn ngữ",
      "example": "学习语言。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Học ngôn ngữ."
    },
    {
      "word": "文字",
      "pinyin": "wén zì",
      "meaning": "Văn tự",
      "example": "汉字是中文的文字。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Chữ Hán là văn tự của tiếng Trung."
    },
    {
      "word": "声音",
      "pinyin": "shēngyīn",
      "meaning": "âm thanh",
      "example": "声音很小。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Âm thanh rất nhỏ."
    },
    {
      "word": "回答",
      "pinyin": "huídá",
      "meaning": "trả lời",
      "example": "回答问题。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Trả lời câu hỏi."
    },
    {
      "word": "帮助",
      "pinyin": "bāngzhù",
      "meaning": "giúp đỡ",
      "example": "谢谢你的帮助。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Cảm ơn sự giúp đỡ của bạn."
    },
    {
      "word": "分析",
      "pinyin": "fēn xī",
      "meaning": "Phân tích",
      "example": "让我们来分析一下这个问题。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Hãy cùng phân tích vấn đề này."
    },
    {
      "word": "未来",
      "pinyin": "wèi lái",
      "meaning": "Tương lai",
      "example": "未来的科技将改变我们的生活。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Công nghệ trong tương lai sẽ thay đổi cuộc sống của chúng ta."
    }
  ],
  "y_te_suc_khoe": [
    {
      "word": "医院",
      "pinyin": "yīyuàn",
      "meaning": "bệnh viện",
      "example": "去医院。",
      "examplePinyin": "Qù yīyuàn.",
      "fromType": "Danh từ",
      "trans": "Đi bệnh viện."
    },
    {
      "word": "医生",
      "pinyin": "yīshēng",
      "meaning": "bác sĩ",
      "example": "他是医生。",
      "examplePinyin": "Tā shì yīshēng.",
      "fromType": "Danh từ",
      "trans": "Anh ấy là bác sĩ."
    },
    {
      "word": "护士",
      "pinyin": "hùshi",
      "meaning": "y tá",
      "example": "护士正在给病人打针。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Y tá đang tiêm cho bệnh nhân."
    },
    {
      "word": "药",
      "pinyin": "yào",
      "meaning": "thuốc",
      "example": "吃药。",
      "examplePinyin": "chī yào.",
      "fromType": "Danh từ",
      "trans": "Uống thuốc."
    },
    {
      "word": "检查",
      "pinyin": "jiǎnchá",
      "meaning": "kiểm tra",
      "example": "去医院检查。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Đi bệnh viện kiểm tra."
    },
    {
      "word": "挂号",
      "pinyin": "guà hào",
      "meaning": "Xếp số",
      "example": "你先去挂号，然后去看医生。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Bạn đi xếp số trước, rồi đến bác sĩ."
    },
    {
      "word": "发烧",
      "pinyin": "fāshāo",
      "meaning": "sốt",
      "example": "我发烧了。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Tôi sốt rồi."
    },
    {
      "word": "头疼",
      "pinyin": "tóuténg",
      "meaning": "đau đầu",
      "example": "我今天头疼。",
      "examplePinyin": "Wǒ jīntiān tóuténg.",
      "fromType": "Động từ/Tính từ",
      "trans": "Hôm nay tôi đau đầu."
    },
    {
      "word": "感冒",
      "pinyin": "gǎnmào",
      "meaning": "cảm cúm",
      "example": "我感冒了。",
      "examplePinyin": "",
      "fromType": "danh từ / động từ",
      "trans": "Tôi bị cảm rồi."
    },
    {
      "word": "健康",
      "pinyin": "jiànkāng",
      "meaning": "khỏe mạnh",
      "example": "身体健康。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Cơ thể khỏe mạnh."
    },
    {
      "word": "病",
      "pinyin": "bìng",
      "meaning": "bệnh, bị bệnh",
      "example": "他病了。",
      "examplePinyin": "Tā bìng le.",
      "fromType": "Danh/Động",
      "trans": "Anh ấy bị bệnh rồi."
    },
    {
      "word": "生病",
      "pinyin": "shēngbìng",
      "meaning": "bị bệnh",
      "example": "我生病了。",
      "examplePinyin": "Wǒ shēngbìng le.",
      "fromType": "Động từ",
      "trans": "Tôi bị bệnh rồi."
    },
    {
      "word": "看病",
      "pinyin": "kànbìng",
      "meaning": "khám bệnh",
      "example": "我去看病。",
      "examplePinyin": "Wǒ qù kànbìng.",
      "fromType": "Động từ",
      "trans": "Tôi đi khám bệnh."
    },
    {
      "word": "身体",
      "pinyin": "shēntǐ",
      "meaning": "cơ thể",
      "example": "身体好吗？",
      "examplePinyin": "shēntǐ hǎo ma?",
      "fromType": "Danh từ",
      "trans": "Sức khỏe bạn thế nào?"
    },
    {
      "word": "休息",
      "pinyin": "xiūxi",
      "meaning": "nghỉ ngơi",
      "example": "休息一下。",
      "examplePinyin": "Xiūxi yīxià.",
      "fromType": "Động từ",
      "trans": "Nghỉ ngơi một chút."
    },
    {
      "word": "疼",
      "pinyin": "téng",
      "meaning": "đau",
      "example": "头疼。",
      "examplePinyin": "tóu téng.",
      "fromType": "Tính, động",
      "trans": "Đau đầu."
    },
    {
      "word": "热",
      "pinyin": "rè",
      "meaning": "nóng",
      "example": "今天很热。",
      "examplePinyin": "Jīntiān hěn rè.",
      "fromType": "Tính từ",
      "trans": "Hôm nay rất nóng."
    },
    {
      "word": "冷",
      "pinyin": "lěng",
      "meaning": "lạnh",
      "example": "今天很冷。",
      "examplePinyin": "Jīntiān hěn lěng.",
      "fromType": "Tính từ",
      "trans": "Hôm nay rất lạnh."
    },
    {
      "word": "水",
      "pinyin": "shuǐ",
      "meaning": "nước",
      "example": "喝水。",
      "examplePinyin": "Hē shuǐ.",
      "fromType": "Danh từ",
      "trans": "Uống nước."
    },
    {
      "word": "睡觉",
      "pinyin": "shuìjiào",
      "meaning": "đi ngủ",
      "example": "我很累，想睡觉。",
      "examplePinyin": "Wǒ hěn lèi, xiǎng shuìjiào.",
      "fromType": "Động từ",
      "trans": "Tôi rất mệt, muốn đi ngủ."
    }
  ],
  "du_lich_khach_san": [
    {
      "word": "去",
      "pinyin": "qù",
      "meaning": "đi",
      "example": "我去学校。",
      "examplePinyin": "Wǒ qù xuéxiào.",
      "fromType": "Động từ",
      "trans": "Tôi đi đến trường."
    },
    {
      "word": "来",
      "pinyin": "lái",
      "meaning": "đến",
      "example": "他来了。",
      "examplePinyin": "Tā lái le.",
      "fromType": "Động từ",
      "trans": "Anh ấy đến rồi."
    },
    {
      "word": "回",
      "pinyin": "huí",
      "meaning": "quay về",
      "example": "回家。",
      "examplePinyin": "Huí jiā.",
      "fromType": "Động từ",
      "trans": "Về nhà."
    },
    {
      "word": "飞机",
      "pinyin": "fēijī",
      "meaning": "máy bay",
      "example": "坐飞机去中国。",
      "examplePinyin": "Zuò fēijī qù Zhōngguó.",
      "fromType": "Danh từ",
      "trans": "Đi máy bay đến Trung Quốc."
    },
    {
      "word": "火车",
      "pinyin": "huǒchē",
      "meaning": "tàu hỏa",
      "example": "坐火车去。",
      "examplePinyin": "Zuò huǒchē qù.",
      "fromType": "Danh từ",
      "trans": "Đi bằng tàu hỏa."
    },
    {
      "word": "出租车",
      "pinyin": "chūzūchē",
      "meaning": "taxi",
      "example": "我们要打出租车。",
      "examplePinyin": "Wǒmen yào dǎ chūzūchē.",
      "fromType": "Danh từ",
      "trans": "Chúng tôi cần bắt taxi."
    },
    {
      "word": "机场",
      "pinyin": "jīchǎng",
      "meaning": "sân bay",
      "example": "我去机场接他。",
      "examplePinyin": "wǒ qù jīchǎng jiē tā.",
      "fromType": "Danh từ",
      "trans": "Tôi đi sân bay đón anh ấy."
    },
    {
      "word": "航班",
      "pinyin": "hángbān",
      "meaning": "chuyến bay",
      "example": "各位顾客,欢迎您乘坐我们的航班。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Quý khách thân mến, chào mừng quý khách đến với chuyến bay của chúng tôi."
    },
    {
      "word": "行李",
      "pinyin": "xíngli",
      "meaning": "hành lý",
      "example": "带行李。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Mang hành lý."
    },
    {
      "word": "酒店",
      "pinyin": "jiǔdiàn",
      "meaning": "khách sạn",
      "example": "住在酒店。",
      "examplePinyin": "zhù zài jiǔdiàn.",
      "fromType": "Danh từ",
      "trans": "Ở tại khách sạn."
    },
    {
      "word": "房间",
      "pinyin": "fángjiān",
      "meaning": "phòng",
      "example": "我的房间很漂亮。",
      "examplePinyin": "Wǒ de fángjiān hěn piàoliang.",
      "fromType": "Danh từ",
      "trans": "Phòng của tôi rất đẹp."
    },
    {
      "word": "房卡",
      "pinyin": "fángkǎ",
      "meaning": "thẻ phòng",
      "example": "请给我房卡。",
      "examplePinyin": "Qǐng gěi wǒ fángkǎ.",
      "fromType": "Danh từ",
      "trans": "Vui lòng đưa thẻ phòng cho tôi."
    },
    {
      "word": "地图",
      "pinyin": "dìtú",
      "meaning": "bản đồ",
      "example": "看地图。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Xem bản đồ."
    },
    {
      "word": "景点",
      "pinyin": "jǐngdiǎn",
      "meaning": "điểm tham quan",
      "example": "这个景点很漂亮。",
      "examplePinyin": "Zhège jǐngdiǎn hěn piàoliang.",
      "fromType": "Danh từ",
      "trans": "Điểm tham quan này rất đẹp."
    },
    {
      "word": "导游",
      "pinyin": "dǎoyóu",
      "meaning": "hướng dẫn viên du lịch",
      "example": "我的姐姐是一名导游。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Chị tôi là hướng dẫn viên du lịch."
    },
    {
      "word": "旅游",
      "pinyin": "lǚyóu",
      "meaning": "du lịch",
      "example": "我想去旅游。",
      "examplePinyin": "wǒ xiǎng qù lǚyóu.",
      "fromType": "Động từ",
      "trans": "Tôi muốn đi du lịch."
    },
    {
      "word": "签证",
      "pinyin": "qiānzhèng",
      "meaning": "visa",
      "example": "办签证。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Làm visa."
    },
    {
      "word": "护照",
      "pinyin": "hùzhào",
      "meaning": "hộ chiếu",
      "example": "带护照。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Mang hộ chiếu."
    },
    {
      "word": "中国",
      "pinyin": "Zhōngguó",
      "meaning": "Trung Quốc",
      "example": "我爱中国。",
      "examplePinyin": "Wǒ ài Zhōngguó.",
      "fromType": "Danh từ",
      "trans": "Tôi yêu Trung Quốc."
    }
  ],
  "nha_hang_do_an": [
    {
      "word": "饭",
      "pinyin": "fàn",
      "meaning": "cơm",
      "example": "我要吃饭。",
      "examplePinyin": "Wǒ yào chī fàn.",
      "fromType": "Danh từ",
      "trans": "Tôi muốn ăn cơm."
    },
    {
      "word": "米饭",
      "pinyin": "mǐfàn",
      "meaning": "cơm",
      "example": "我喜欢吃米饭。",
      "examplePinyin": "Wǒ xǐhuan chī mǐfàn.",
      "fromType": "Danh từ",
      "trans": "Tôi thích ăn cơm."
    },
    {
      "word": "面包",
      "pinyin": "miànbāo",
      "meaning": "bánh mì",
      "example": "吃面包。",
      "examplePinyin": "Chī miànbāo.",
      "fromType": "Danh từ",
      "trans": "Ăn bánh mì."
    },
    {
      "word": "面条儿",
      "pinyin": "miàntiáor",
      "meaning": "mì",
      "example": "这面条儿好吃。",
      "examplePinyin": "Zhè miàntiáor hǎochī.",
      "fromType": "Danh từ",
      "trans": "Mì này rất ngon."
    },
    {
      "word": "包子",
      "pinyin": "bāozi",
      "meaning": "bánh bao",
      "example": "我要两个包子。",
      "examplePinyin": "Wǒ yào liǎng gè bāozi.",
      "fromType": "Danh từ",
      "trans": "Tôi muốn lấy hai cái bánh bao."
    },
    {
      "word": "饺子",
      "pinyin": "jiǎozi",
      "meaning": "sủi cảo",
      "example": "吃饺子。",
      "examplePinyin": "Chī jiǎozi.",
      "fromType": "Danh từ",
      "trans": "Ăn sủi cảo."
    },
    {
      "word": "鸡蛋",
      "pinyin": "jīdàn",
      "meaning": "trứng gà",
      "example": "吃鸡蛋。",
      "examplePinyin": "Chī jīdàn.",
      "fromType": "Danh từ",
      "trans": "Ăn trứng gà."
    },
    {
      "word": "牛奶",
      "pinyin": "niúnǎi",
      "meaning": "sữa",
      "example": "喝牛奶。",
      "examplePinyin": "Hē niúnǎi.",
      "fromType": "Danh từ",
      "trans": "Uống sữa."
    },
    {
      "word": "茶",
      "pinyin": "chá",
      "meaning": "trà",
      "example": "喝一杯茶。",
      "examplePinyin": "Hē yī bēi chá.",
      "fromType": "Danh từ",
      "trans": "Uống một chén trà."
    },
    {
      "word": "水",
      "pinyin": "shuǐ",
      "meaning": "nước",
      "example": "喝水。",
      "examplePinyin": "Hē shuǐ.",
      "fromType": "Danh từ",
      "trans": "Uống nước."
    },
    {
      "word": "菜单",
      "pinyin": "càidān",
      "meaning": "thực đơn",
      "example": "给我菜单。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Cho tôi xem thực đơn."
    },
    {
      "word": "服务员",
      "pinyin": "fúwùyuán",
      "meaning": "nhân viên phục vụ",
      "example": "我在饭馆做服务员。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Tôi làm phục vụ ở nhà hàng."
    },
    {
      "word": "点菜",
      "pinyin": "diǎncài",
      "meaning": "gọi món",
      "example": "我们开始点菜吧。",
      "examplePinyin": "Wǒmen kāishǐ diǎncài ba.",
      "fromType": "Động từ",
      "trans": "Chúng ta bắt đầu gọi món nhé."
    },
    {
      "word": "结账",
      "pinyin": "jié zhàng",
      "meaning": "Thanh toán",
      "example": "我们要结账了，请给我账单。",
      "examplePinyin": "",
      "fromType": "Động từ",
      "trans": "Chúng tôi cần thanh toán, làm ơn đưa hóa đơn cho tôi."
    },
    {
      "word": "发票",
      "pinyin": "fā piào",
      "meaning": "Hóa đơn giá trị gia tăng",
      "example": "请给我发票。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Xin vui lòng cho tôi hóa đơn."
    },
    {
      "word": "筷子",
      "pinyin": "kuàizi",
      "meaning": "đũa",
      "example": "用筷子。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Dùng đũa."
    },
    {
      "word": "勺子",
      "pinyin": "sháozi",
      "meaning": "cái thìa",
      "example": "用勺子。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Dùng thìa."
    },
    {
      "word": "辣",
      "pinyin": "là",
      "meaning": "cay",
      "example": "我不习惯吃太辣的菜。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Tôi không quen ăn món quá cay."
    },
    {
      "word": "甜",
      "pinyin": "tián",
      "meaning": "ngọt",
      "example": "这个很甜。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Cái này rất ngọt."
    },
    {
      "word": "咸",
      "pinyin": "xián",
      "meaning": "mặn",
      "example": "盐放多了,菜有点儿~。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Cho nhiều muối quá, món ăn hơi mặn."
    }
  ],
  "cam_xuc_tinh_cach": [
    {
      "word": "高兴",
      "pinyin": "gāoxìng",
      "meaning": "vui",
      "example": "认识你很高兴。",
      "examplePinyin": "Rènshi nǐ hěn gāoxìng.",
      "fromType": "Tính từ",
      "trans": "Rất vui được làm quen với bạn."
    },
    {
      "word": "开心",
      "pinyin": "kāixīn",
      "meaning": "vui vẻ",
      "example": "我很开心。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Tôi rất vui vẻ."
    },
    {
      "word": "难过",
      "pinyin": "nánguò",
      "meaning": "buồn",
      "example": "别难过。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Đừng buồn."
    },
    {
      "word": "紧张",
      "pinyin": "jǐnzhāng",
      "meaning": "căng thẳng, lo lắng",
      "example": "第一次演出,他很紧张。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Lần đầu biểu diễn, anh ấy rất căng thẳng."
    },
    {
      "word": "害怕",
      "pinyin": "hàipà",
      "meaning": "sợ",
      "example": "别害怕。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Đừng sợ."
    },
    {
      "word": "满意",
      "pinyin": "mǎnyì",
      "meaning": "hài lòng",
      "example": "我很满意。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Tôi rất hài lòng."
    },
    {
      "word": "担心",
      "pinyin": "dānxīn",
      "meaning": "lo lắng",
      "example": "别担心。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Đừng lo lắng."
    },
    {
      "word": "幸福",
      "pinyin": "xìngfú",
      "meaning": "hạnh phúc",
      "example": "我生活得很~。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Tôi sống rất hạnh phúc."
    },
    {
      "word": "惊讶",
      "pinyin": "jīngyà",
      "meaning": "ngạc nhiên",
      "example": "我感到很惊讶。",
      "examplePinyin": "Wǒ gǎndào hěn jīngyà.",
      "fromType": "Tính từ",
      "trans": "Tôi cảm thấy rất ngạc nhiên."
    },
    {
      "word": "认真",
      "pinyin": "rènzhēn",
      "meaning": "nghiêm túc",
      "example": "学习很认真。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Học tập rất nghiêm túc."
    },
    {
      "word": "礼貌",
      "pinyin": "lǐmào",
      "meaning": "lịch sự",
      "example": "这个小朋友很有礼貌。",
      "examplePinyin": "",
      "fromType": "n.",
      "trans": "Đứa trẻ này rất lịch sự."
    },
    {
      "word": "漂亮",
      "pinyin": "piàoliang",
      "meaning": "xinh đẹp",
      "example": "你很漂亮。",
      "examplePinyin": "Nǐ hěn piàoliang.",
      "fromType": "Tính từ",
      "trans": "Bạn rất xinh đẹp."
    },
    {
      "word": "好",
      "pinyin": "hǎo",
      "meaning": "tốt",
      "example": "身体很好。",
      "examplePinyin": "Shēntǐ hěn hǎo.",
      "fromType": "Tính từ",
      "trans": "Sức khỏe rất tốt."
    },
    {
      "word": "好看",
      "pinyin": "hǎokàn",
      "meaning": "đẹp",
      "example": "那个人很好看。",
      "examplePinyin": "Nà gè rén hěn hǎokàn.",
      "fromType": "Tính từ",
      "trans": "Người kia trông rất đẹp."
    },
    {
      "word": "好听",
      "pinyin": "hǎotīng",
      "meaning": "hay",
      "example": "音乐很好听。",
      "examplePinyin": "Yīnyuè hěn hǎotīng.",
      "fromType": "Tính từ",
      "trans": "Âm nhạc rất hay."
    },
    {
      "word": "可爱",
      "pinyin": "kě’ài",
      "meaning": "đáng yêu",
      "example": "他很可爱。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Cậu ấy rất đáng yêu."
    },
    {
      "word": "累",
      "pinyin": "lèi",
      "meaning": "mệt",
      "example": "我太累了。",
      "examplePinyin": "wǒ tài lèi le.",
      "fromType": "Tính từ",
      "trans": "Tôi mệt quá."
    },
    {
      "word": "喜欢",
      "pinyin": "xǐhuan",
      "meaning": "thích",
      "example": "我喜欢看电影。",
      "examplePinyin": "Wǒ xǐhuan kàn diànyǐng.",
      "fromType": "Động từ",
      "trans": "Tôi thích xem phim."
    },
    {
      "word": "爱",
      "pinyin": "ài",
      "meaning": "yêu, thích",
      "example": "我爱吃米饭。",
      "examplePinyin": "Wǒ ài chī mǐfàn.",
      "fromType": "Động từ",
      "trans": "Tôi thích ăn cơm."
    },
    {
      "word": "想",
      "pinyin": "xiǎng",
      "meaning": "muốn, nhớ",
      "example": "我想你。",
      "examplePinyin": "Wǒ xiǎng nǐ.",
      "fromType": "Động từ",
      "trans": "Tôi nhớ bạn."
    }
  ],
  "nhan_vat_dai_tu": [
    {
      "word": "我",
      "pinyin": "wǒ",
      "meaning": "tôi",
      "example": "我是学生。",
      "examplePinyin": "Wǒ shì xuéshēng.",
      "fromType": "Đại từ",
      "trans": "Tôi là học sinh."
    },
    {
      "word": "你",
      "pinyin": "nǐ",
      "meaning": "bạn",
      "example": "你好吗？",
      "examplePinyin": "Nǐ hǎo ma?",
      "fromType": "Đại từ",
      "trans": "Bạn khỏe không?"
    },
    {
      "word": "他",
      "pinyin": "tā",
      "meaning": "anh ấy",
      "example": "他是我的老师。",
      "examplePinyin": "Tā shì wǒ de lǎoshī.",
      "fromType": "Đại từ",
      "trans": "Anh ấy là giáo viên của tôi."
    },
    {
      "word": "她",
      "pinyin": "tā",
      "meaning": "cô ấy",
      "example": "她很漂亮。",
      "examplePinyin": "Tā hěn piàoliang.",
      "fromType": "Đại từ",
      "trans": "Cô ấy rất xinh đẹp."
    },
    {
      "word": "它",
      "pinyin": "tā",
      "meaning": "nó (đồ vật/con vật)",
      "example": "它是一只猫。",
      "examplePinyin": "Tā shì yī zhī māo.",
      "fromType": "Đại từ",
      "trans": "Nó là một con mèo."
    },
    {
      "word": "我们",
      "pinyin": "wǒmen",
      "meaning": "chúng tôi",
      "example": "我们去吧。",
      "examplePinyin": "Wǒmen qù ba.",
      "fromType": "Đại từ",
      "trans": "Chúng ta đi thôi."
    },
    {
      "word": "你们",
      "pinyin": "nǐmen",
      "meaning": "các bạn",
      "example": "你们好。",
      "examplePinyin": "Nǐmen hǎo.",
      "fromType": "Đại từ",
      "trans": "Chào các bạn."
    },
    {
      "word": "他们",
      "pinyin": "tāmen",
      "meaning": "họ",
      "example": "他们是同学。",
      "examplePinyin": "Tāmen shì tóngxué.",
      "fromType": "Đại từ",
      "trans": "Họ là bạn học."
    },
    {
      "word": "她们",
      "pinyin": "tāmen",
      "meaning": "họ (nữ)",
      "example": "她们是好朋友。",
      "examplePinyin": "Tāmen shì hǎo péngyou.",
      "fromType": "Đại từ",
      "trans": "Họ là bạn tốt."
    },
    {
      "word": "它们",
      "pinyin": "tāmen",
      "meaning": "chúng nó, chúng (đồ vật/con vật)",
      "example": "它们在吃东西。",
      "examplePinyin": "Tāmen zài chī dōngxi.",
      "fromType": "Đại từ",
      "trans": "Chúng nó đang ăn đồ ăn."
    },
    {
      "word": "大家",
      "pinyin": "dàjiā",
      "meaning": "mọi người",
      "example": "大家好！",
      "examplePinyin": "Dàjiā hǎo!",
      "fromType": "Đại từ",
      "trans": "Chào mọi người!"
    },
    {
      "word": "人",
      "pinyin": "rén",
      "meaning": "người",
      "example": "他是哪国人？",
      "examplePinyin": "Tā shì nǎ guó rén?",
      "fromType": "Danh từ",
      "trans": "Anh ấy là người nước nào?"
    },
    {
      "word": "男人",
      "pinyin": "nánrén",
      "meaning": "đàn ông",
      "example": "是个男人。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Là đàn ông."
    },
    {
      "word": "女人",
      "pinyin": "nǚrén",
      "meaning": "phụ nữ",
      "example": "她是女人。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Cô ấy là phụ nữ."
    },
    {
      "word": "朋友",
      "pinyin": "péngyou",
      "meaning": "bạn bè",
      "example": "我们是朋友。",
      "examplePinyin": "Wǒmen shì péngyou.",
      "fromType": "Danh từ",
      "trans": "Chúng tôi là bạn bè."
    },
    {
      "word": "同学",
      "pinyin": "tóngxué",
      "meaning": "bạn học",
      "example": "他是我的同学。",
      "examplePinyin": "Tā shì wǒ de tóngxué.",
      "fromType": "Danh từ",
      "trans": "Anh ấy là bạn học của tôi."
    },
    {
      "word": "老师",
      "pinyin": "lǎoshī",
      "meaning": "giáo viên",
      "example": "她是我们的老师。",
      "examplePinyin": "Tā shì wǒmen de lǎoshī.",
      "fromType": "Danh từ",
      "trans": "Cô ấy là giáo viên của chúng tôi."
    },
    {
      "word": "学生",
      "pinyin": "xuéshēng",
      "meaning": "học sinh",
      "example": "我是学生。",
      "examplePinyin": "Wǒ shì xuéshēng.",
      "fromType": "Danh từ",
      "trans": "Tôi là học sinh."
    },
    {
      "word": "先生",
      "pinyin": "xiānsheng",
      "meaning": "ông, ngài",
      "example": "李先生。",
      "examplePinyin": "Lǐ xiānsheng.",
      "fromType": "Danh từ",
      "trans": "Ông Lý."
    },
    {
      "word": "女士",
      "pinyin": "nǚshì",
      "meaning": "quý bà",
      "example": "这位女士是谁？",
      "examplePinyin": "Zhè wèi nǚshì shì shéi?",
      "fromType": "Danh từ",
      "trans": "Quý bà này là ai?"
    }
  ],
  "thoi_gian_lich": [
    {
      "word": "今天",
      "pinyin": "jīntiān",
      "meaning": "hôm nay",
      "example": "今天很热。",
      "examplePinyin": "Jīntiān hěn rè.",
      "fromType": "Danh từ",
      "trans": "Hôm nay rất nóng."
    },
    {
      "word": "明天",
      "pinyin": "míngtiān",
      "meaning": "ngày mai",
      "example": "明天见。",
      "examplePinyin": "Míngtiān jiàn.",
      "fromType": "Danh từ",
      "trans": "Ngày mai gặp lại."
    },
    {
      "word": "昨天",
      "pinyin": "zuótiān",
      "meaning": "hôm qua",
      "example": "昨天很冷。",
      "examplePinyin": "Zuótiān hěn lěng.",
      "fromType": "Danh từ",
      "trans": "Hôm qua rất lạnh."
    },
    {
      "word": "今年",
      "pinyin": "jīnnián",
      "meaning": "năm nay",
      "example": "今年是2026年。",
      "examplePinyin": "Jīnnián shì 2026 nián.",
      "fromType": "Danh từ",
      "trans": "Năm nay là năm 2026."
    },
    {
      "word": "明年",
      "pinyin": "míngnián",
      "meaning": "năm sau",
      "example": "明年我去中国。",
      "examplePinyin": "Míngnián wǒ qù Zhōngguó.",
      "fromType": "Danh từ",
      "trans": "Năm sau tôi đi Trung Quốc."
    },
    {
      "word": "去年",
      "pinyin": "qùnián",
      "meaning": "năm ngoái",
      "example": "去年我没去。",
      "examplePinyin": "Qùnián wǒ méi qù.",
      "fromType": "Danh từ",
      "trans": "Năm ngoái tôi không đi."
    },
    {
      "word": "上午",
      "pinyin": "shàngwǔ",
      "meaning": "buổi sáng",
      "example": "上午十点。",
      "examplePinyin": "Shàngwǔ shí diǎn.",
      "fromType": "Danh từ",
      "trans": "Mười giờ sáng."
    },
    {
      "word": "中午",
      "pinyin": "zhōngwǔ",
      "meaning": "buổi trưa",
      "example": "中午十二点。",
      "examplePinyin": "Zhōngwǔ shí'èr diǎn.",
      "fromType": "Danh từ",
      "trans": "Mười hai giờ trưa."
    },
    {
      "word": "下午",
      "pinyin": "xiàwǔ",
      "meaning": "buổi chiều",
      "example": "下午好。",
      "examplePinyin": "Xiàwǔ hǎo.",
      "fromType": "Danh từ",
      "trans": "Chào buổi chiều."
    },
    {
      "word": "晚上",
      "pinyin": "wǎnshang",
      "meaning": "buổi tối",
      "example": "晚上好。",
      "examplePinyin": "Wǎnshang hǎo.",
      "fromType": "Danh từ",
      "trans": "Chào buổi tối."
    },
    {
      "word": "时间",
      "pinyin": "shíjiān",
      "meaning": "thời gian",
      "example": "没时间。",
      "examplePinyin": "Méi shíjiān.",
      "fromType": "Danh từ",
      "trans": "Không có thời gian."
    },
    {
      "word": "时候",
      "pinyin": "shíhou",
      "meaning": "lúc",
      "example": "什么时候？",
      "examplePinyin": "Shénme shíhou?",
      "fromType": "Danh từ",
      "trans": "Lúc nào?"
    },
    {
      "word": "年",
      "pinyin": "nián",
      "meaning": "năm",
      "example": "今年。",
      "examplePinyin": "Jīnnián.",
      "fromType": "Danh/Lượng",
      "trans": "Năm nay."
    },
    {
      "word": "月",
      "pinyin": "yuè",
      "meaning": "tháng",
      "example": "一月。",
      "examplePinyin": "Yī yuè.",
      "fromType": "Danh từ",
      "trans": "Tháng một."
    },
    {
      "word": "日",
      "pinyin": "rì",
      "meaning": "ngày",
      "example": "五月一日。",
      "examplePinyin": "Wǔ yuè yī rì.",
      "fromType": "Danh/Lượng",
      "trans": "Ngày 1 tháng 5."
    },
    {
      "word": "号",
      "pinyin": "hào",
      "meaning": "số, ngày",
      "example": "今天几号？",
      "examplePinyin": "Jīntiān jǐ hào?",
      "fromType": "Danh/Lượng",
      "trans": "Hôm nay ngày mấy?"
    },
    {
      "word": "点",
      "pinyin": "diǎn",
      "meaning": "giờ",
      "example": "现在几点？",
      "examplePinyin": "Xiànzài jǐ diǎn?",
      "fromType": "Lượng từ",
      "trans": "Bây giờ là mấy giờ?"
    },
    {
      "word": "分",
      "pinyin": "fēn",
      "meaning": "phút",
      "example": "八点五分。",
      "examplePinyin": "Bā diǎn wǔ fēn.",
      "fromType": "Lượng từ",
      "trans": "Tám giờ năm phút."
    },
    {
      "word": "分钟",
      "pinyin": "fēnzhōng",
      "meaning": "phút",
      "example": "等我五分钟。",
      "examplePinyin": "Děng wǒ wǔ fēnzhōng.",
      "fromType": "Lượng từ",
      "trans": "Đợi tôi năm phút."
    },
    {
      "word": "星期",
      "pinyin": "xīngqī",
      "meaning": "tuần",
      "example": "星期一。",
      "examplePinyin": "Xīngqī yī.",
      "fromType": "Danh từ",
      "trans": "Thứ hai."
    }
  ],
  "mau_sac_hinh_dang": [
    {
      "word": "白",
      "pinyin": "bái",
      "meaning": "trắng",
      "example": "我很爱穿那件白衣服。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Tôi rất thích mặc bộ quần áo màu trắng đó."
    },
    {
      "word": "黑",
      "pinyin": "hēi",
      "meaning": "đen, tối",
      "example": "我不喜欢黑颜色的衣服。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Tôi không thích quần áo màu đen."
    },
    {
      "word": "红",
      "pinyin": "hóng",
      "meaning": "đỏ",
      "example": "我的自行车是红色的。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Xe đạp của tôi màu đỏ."
    },
    {
      "word": "蓝",
      "pinyin": "lán",
      "meaning": "màu xanh lam",
      "example": "蓝色的。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Màu xanh lam."
    },
    {
      "word": "绿",
      "pinyin": "lǜ",
      "meaning": "xanh lá",
      "example": "春天来了,树和草都绿了。",
      "examplePinyin": "",
      "fromType": "adj.",
      "trans": "Mùa xuân đến rồi, cây và cỏ đều xanh rồi."
    },
    {
      "word": "颜色",
      "pinyin": "yánsè",
      "meaning": "màu sắc",
      "example": "你喜欢什么颜色？",
      "examplePinyin": "nǐ xǐhuān shénme yánsè?",
      "fromType": "Danh từ",
      "trans": "Bạn thích màu gì?"
    },
    {
      "word": "大",
      "pinyin": "dà",
      "meaning": "to, lớn",
      "example": "这个苹果很大。",
      "examplePinyin": "Zhège píngguǒ hěn dà.",
      "fromType": "Tính từ",
      "trans": "Quả táo này rất to."
    },
    {
      "word": "小",
      "pinyin": "xiǎo",
      "meaning": "nhỏ",
      "example": "小猫。",
      "examplePinyin": "Xiǎo māo.",
      "fromType": "Tính từ",
      "trans": "Con mèo nhỏ."
    },
    {
      "word": "长",
      "pinyin": "cháng",
      "meaning": "dài",
      "example": "头发很长。",
      "examplePinyin": "tóufa hěn cháng.",
      "fromType": "Tính từ",
      "trans": "Tóc rất dài."
    },
    {
      "word": "短",
      "pinyin": "duǎn",
      "meaning": "ngắn",
      "example": "头发太短了。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Tóc ngắn quá rồi."
    },
    {
      "word": "高",
      "pinyin": "gāo",
      "meaning": "cao",
      "example": "他很高。",
      "examplePinyin": "tā hěn gāo.",
      "fromType": "Tính từ",
      "trans": "Anh ấy rất cao."
    },
    {
      "word": "矮",
      "pinyin": "ǎi",
      "meaning": "thấp",
      "example": "他长得很矮。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Anh ấy thấp."
    },
    {
      "word": "胖",
      "pinyin": "pàng",
      "meaning": "béo",
      "example": "他胖了。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Anh ấy béo rồi."
    },
    {
      "word": "瘦",
      "pinyin": "shòu",
      "meaning": "gầy",
      "example": "他很瘦。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Anh ấy rất gầy."
    },
    {
      "word": "漂亮",
      "pinyin": "piàoliang",
      "meaning": "xinh đẹp",
      "example": "你很漂亮。",
      "examplePinyin": "Nǐ hěn piàoliang.",
      "fromType": "Tính từ",
      "trans": "Bạn rất xinh đẹp."
    },
    {
      "word": "圆",
      "pinyin": "yuán",
      "meaning": "Hình tròn",
      "example": "这个桌子是圆形的。",
      "examplePinyin": "",
      "fromType": "Tính từ",
      "trans": "Cái bàn này có hình tròn."
    },
    {
      "word": "方",
      "pinyin": "fāng",
      "meaning": "Phương",
      "example": "向四方寻找解决办法。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Tìm kiếm giải pháp theo mọi hướng."
    },
    {
      "word": "新",
      "pinyin": "xīn",
      "meaning": "mới",
      "example": "这是新电脑。",
      "examplePinyin": "Zhè shì xīn diànnǎo.",
      "fromType": "Tính từ",
      "trans": "Đây là máy tính mới."
    },
    {
      "word": "旧",
      "pinyin": "jiù",
      "meaning": "cũ",
      "example": "衣服太旧了。",
      "examplePinyin": "",
      "fromType": "tính từ",
      "trans": "Quần áo cũ quá rồi."
    }
  ],
  "giao_thong_phuong_huong": [
    {
      "word": "车",
      "pinyin": "chē",
      "meaning": "xe",
      "example": "我坐车去学校。",
      "examplePinyin": "Wǒ zuò chē qù xuéxiào.",
      "fromType": "Danh từ",
      "trans": "Tôi đi xe đến trường."
    },
    {
      "word": "开车",
      "pinyin": "kāichē",
      "meaning": "lái xe",
      "example": "爸爸会开车。",
      "examplePinyin": "Bàba huì kāichē.",
      "fromType": "Động từ",
      "trans": "Bố biết lái xe."
    },
    {
      "word": "飞机",
      "pinyin": "fēijī",
      "meaning": "máy bay",
      "example": "坐飞机去中国。",
      "examplePinyin": "Zuò fēijī qù Zhōngguó.",
      "fromType": "Danh từ",
      "trans": "Đi máy bay đến Trung Quốc."
    },
    {
      "word": "火车",
      "pinyin": "huǒchē",
      "meaning": "tàu hỏa",
      "example": "坐火车去。",
      "examplePinyin": "Zuò huǒchē qù.",
      "fromType": "Danh từ",
      "trans": "Đi bằng tàu hỏa."
    },
    {
      "word": "出租车",
      "pinyin": "chūzūchē",
      "meaning": "taxi",
      "example": "我们要打出租车。",
      "examplePinyin": "Wǒmen yào dǎ chūzūchē.",
      "fromType": "Danh từ",
      "trans": "Chúng tôi cần bắt taxi."
    },
    {
      "word": "路",
      "pinyin": "lù",
      "meaning": "đường",
      "example": "路很长。",
      "examplePinyin": "lù hěn cháng.",
      "fromType": "Danh từ",
      "trans": "Con đường rất dài."
    },
    {
      "word": "上",
      "pinyin": "shàng",
      "meaning": "trên",
      "example": "桌子上。",
      "examplePinyin": "Zhuōzi shàng.",
      "fromType": "Danh/Động",
      "trans": "Trên bàn."
    },
    {
      "word": "下",
      "pinyin": "xià",
      "meaning": "dưới",
      "example": "下边。",
      "examplePinyin": "Xiàbian.",
      "fromType": "Danh/Động",
      "trans": "Phía dưới."
    },
    {
      "word": "前",
      "pinyin": "qián",
      "meaning": "trước",
      "example": "以前。",
      "examplePinyin": "Yǐqián.",
      "fromType": "Danh từ",
      "trans": "Trước đây."
    },
    {
      "word": "后",
      "pinyin": "hòu",
      "meaning": "sau",
      "example": "以后。",
      "examplePinyin": "Yǐhòu.",
      "fromType": "Danh từ",
      "trans": "Sau này."
    },
    {
      "word": "里",
      "pinyin": "lǐ",
      "meaning": "bên trong",
      "example": "屋子里有人。",
      "examplePinyin": "Wūzi lǐ yǒu rén.",
      "fromType": "Danh từ",
      "trans": "Trong phòng có người."
    },
    {
      "word": "外",
      "pinyin": "wài",
      "meaning": "bên ngoài",
      "example": "外边很冷。",
      "examplePinyin": "Wàibian hěn lěng.",
      "fromType": "Danh từ",
      "trans": "Bên ngoài rất lạnh."
    },
    {
      "word": "左",
      "pinyin": "zuǒ",
      "meaning": "bên trái",
      "example": "向左转。",
      "examplePinyin": "xiàng zuǒ zhuǎn.",
      "fromType": "Danh từ",
      "trans": "Quay sang trái."
    },
    {
      "word": "右",
      "pinyin": "yòu",
      "meaning": "bên phải",
      "example": "向右看。",
      "examplePinyin": "xiàng yòu kàn.",
      "fromType": "Danh từ",
      "trans": "Nhìn sang bên phải."
    },
    {
      "word": "旁边",
      "pinyin": "pángbiān",
      "meaning": "bên cạnh",
      "example": "在我旁边。",
      "examplePinyin": "zài wǒ pángbiān.",
      "fromType": "Danh từ",
      "trans": "Ở bên cạnh tôi."
    },
    {
      "word": "这边",
      "pinyin": "zhèbiān",
      "meaning": "bên này",
      "example": "请这边走。",
      "examplePinyin": "Qǐng zhèbiān zǒu.",
      "fromType": "Đại từ",
      "trans": "Mời đi lối này."
    },
    {
      "word": "那边",
      "pinyin": "nàbiān",
      "meaning": "bên kia",
      "example": "在路那边。",
      "examplePinyin": "Zài lù nà biān.",
      "fromType": "Đại từ",
      "trans": "Ở phía bên kia đường."
    },
    {
      "word": "到",
      "pinyin": "dào",
      "meaning": "đến",
      "example": "我到了。",
      "examplePinyin": "Wǒ dào le.",
      "fromType": "Động từ",
      "trans": "Tôi đến nơi rồi."
    },
    {
      "word": "离",
      "pinyin": "lí",
      "meaning": "cách",
      "example": "离这儿很远。",
      "examplePinyin": "lí zhè'er hěn yuǎn.",
      "fromType": "Động từ",
      "trans": "Cách đây rất xa."
    }
  ],
  "hoc_tap_giao_duc": [
    {
      "word": "学校",
      "pinyin": "xuéxiào",
      "meaning": "trường học",
      "example": "学校很大。",
      "examplePinyin": "Xuéxiào hěn dà.",
      "fromType": "Danh từ",
      "trans": "Trường học rất lớn."
    },
    {
      "word": "大学",
      "pinyin": "dàxué",
      "meaning": "đại học",
      "example": "他在大学读书。",
      "examplePinyin": "Tā zài dàxué dúshū.",
      "fromType": "Danh từ",
      "trans": "Anh ấy học ở đại học."
    },
    {
      "word": "大学生",
      "pinyin": "dàxuéshēng",
      "meaning": "sinh viên",
      "example": "他是一个大学生。",
      "examplePinyin": "Tā shì yī gè dàxuéshēng.",
      "fromType": "Danh từ",
      "trans": "Anh ấy là một sinh viên."
    },
    {
      "word": "老师",
      "pinyin": "lǎoshī",
      "meaning": "giáo viên",
      "example": "她是我们的老师。",
      "examplePinyin": "Tā shì wǒmen de lǎoshī.",
      "fromType": "Danh từ",
      "trans": "Cô ấy là giáo viên của chúng tôi."
    },
    {
      "word": "学生",
      "pinyin": "xuéshēng",
      "meaning": "học sinh",
      "example": "我是学生。",
      "examplePinyin": "Wǒ shì xuéshēng.",
      "fromType": "Danh từ",
      "trans": "Tôi là học sinh."
    },
    {
      "word": "同学",
      "pinyin": "tóngxué",
      "meaning": "bạn học",
      "example": "他是我的同学。",
      "examplePinyin": "Tā shì wǒ de tóngxué.",
      "fromType": "Danh từ",
      "trans": "Anh ấy là bạn học của tôi."
    },
    {
      "word": "上课",
      "pinyin": "shàngkè",
      "meaning": "lên lớp",
      "example": "我们去上课。",
      "examplePinyin": "Wǒmen qù shàngkè.",
      "fromType": "Động từ",
      "trans": "Chúng ta đi học."
    },
    {
      "word": "下课",
      "pinyin": "xiàkè",
      "meaning": "tan học",
      "example": "老师，下课了。",
      "examplePinyin": "Lǎoshī, xiàkè le.",
      "fromType": "Động từ",
      "trans": "Thầy ơi, tan học rồi."
    },
    {
      "word": "课",
      "pinyin": "kè",
      "meaning": "bài học",
      "example": "这节课很难。",
      "examplePinyin": "Zhè jié kè hěn nán.",
      "fromType": "Danh từ",
      "trans": "Tiết học này rất khó."
    },
    {
      "word": "书",
      "pinyin": "shū",
      "meaning": "sách",
      "example": "看书。",
      "examplePinyin": "Kàn shū.",
      "fromType": "Danh từ",
      "trans": "Đọc sách."
    },
    {
      "word": "书店",
      "pinyin": "shūdiàn",
      "meaning": "hiệu sách",
      "example": "去书店。",
      "examplePinyin": "Qù shūdiàn.",
      "fromType": "Danh từ",
      "trans": "Đi hiệu sách."
    },
    {
      "word": "读",
      "pinyin": "dú",
      "meaning": "đọc",
      "example": "读汉字。",
      "examplePinyin": "Dú Hànzì.",
      "fromType": "Động từ",
      "trans": "Đọc chữ Hán."
    },
    {
      "word": "读书",
      "pinyin": "dúshū",
      "meaning": "đọc sách, học",
      "example": "他正在读书。",
      "examplePinyin": "Tā zhèngzài dúshū.",
      "fromType": "Động từ",
      "trans": "Anh ấy đang đọc sách."
    },
    {
      "word": "写",
      "pinyin": "xiě",
      "meaning": "viết",
      "example": "写汉字。",
      "examplePinyin": "Xiě Hànzì.",
      "fromType": "Động từ",
      "trans": "Viết chữ Hán."
    },
    {
      "word": "汉语",
      "pinyin": "Hànyǔ",
      "meaning": "tiếng Trung",
      "example": "学汉语。",
      "examplePinyin": "Xué Hànyǔ.",
      "fromType": "Danh từ",
      "trans": "Học tiếng Trung."
    },
    {
      "word": "汉字",
      "pinyin": "Hànzì",
      "meaning": "chữ Hán",
      "example": "汉字很难写。",
      "examplePinyin": "Hànzì hěn nán xiě.",
      "fromType": "Danh từ",
      "trans": "Chữ Hán rất khó viết."
    },
    {
      "word": "考试",
      "pinyin": "kǎoshì",
      "meaning": "kỳ thi",
      "example": "考试很难。",
      "examplePinyin": "kǎoshì hěn nán.",
      "fromType": "Động, danh",
      "trans": "Kỳ thi rất khó."
    },
    {
      "word": "学习",
      "pinyin": "xuéxí",
      "meaning": "học tập",
      "example": "学习很努力。",
      "examplePinyin": "Xuéxí hěn nǔlì.",
      "fromType": "Động từ",
      "trans": "Học tập rất nỗ lực."
    },
    {
      "word": "作业",
      "pinyin": "zuòyè",
      "meaning": "bài tập",
      "example": "做作业。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Làm bài tập."
    },
    {
      "word": "作文",
      "pinyin": "zuò wén",
      "meaning": "Bài văn",
      "example": "我们的作文题目是“我的梦想”。",
      "examplePinyin": "",
      "fromType": "Danh từ",
      "trans": "Đề bài văn của chúng tôi là \"Ước mơ của tôi\"."
    }
  ],
  "nha_cua_doi_song": [
    {
      "word": "家",
      "pinyin": "jiā",
      "meaning": "nhà",
      "example": "我家在这里。",
      "examplePinyin": "Wǒ jiā zài zhèlǐ.",
      "fromType": "Danh từ",
      "trans": "Nhà tôi ở đây."
    },
    {
      "word": "房间",
      "pinyin": "fángjiān",
      "meaning": "phòng",
      "example": "我的房间很漂亮。",
      "examplePinyin": "Wǒ de fángjiān hěn piàoliang.",
      "fromType": "Danh từ",
      "trans": "Phòng của tôi rất đẹp."
    },
    {
      "word": "门",
      "pinyin": "mén",
      "meaning": "cửa",
      "example": "关门。",
      "examplePinyin": "guān mén.",
      "fromType": "Danh từ",
      "trans": "Đóng cửa."
    },
    {
      "word": "桌子",
      "pinyin": "zhuōzi",
      "meaning": "cái bàn",
      "example": "桌子上有书。",
      "examplePinyin": "Zhuōzi shàng yǒu shū.",
      "fromType": "Danh từ",
      "trans": "Trên bàn có sách."
    },
    {
      "word": "椅子",
      "pinyin": "yǐzi",
      "meaning": "cái ghế",
      "example": "坐在椅子上。",
      "examplePinyin": "Zuò zài yǐzi shàng.",
      "fromType": "Danh từ",
      "trans": "Ngồi trên ghế."
    },
    {
      "word": "杯子",
      "pinyin": "bēizi",
      "meaning": "cái cốc",
      "example": "杯子在桌子上。",
      "examplePinyin": "Bēizi zài zhuōzi shàng.",
      "fromType": "Danh từ",
      "trans": "Cái cốc ở trên bàn."
    },
    {
      "word": "电视",
      "pinyin": "diànshì",
      "meaning": "tivi",
      "example": "看电视。",
      "examplePinyin": "Kàn diànshì.",
      "fromType": "Danh từ",
      "trans": "Xem tivi."
    },
    {
      "word": "衣服",
      "pinyin": "yīfu",
      "meaning": "quần áo",
      "example": "这件衣服很漂亮。",
      "examplePinyin": "Zhè jiàn yīfu hěn piàoliang.",
      "fromType": "Danh từ",
      "trans": "Bộ quần áo này rất đẹp."
    },
    {
      "word": "睡觉",
      "pinyin": "shuìjiào",
      "meaning": "đi ngủ",
      "example": "我很累，想睡觉。",
      "examplePinyin": "Wǒ hěn lèi, xiǎng shuìjiào.",
      "fromType": "Động từ",
      "trans": "Tôi rất mệt, muốn đi ngủ."
    },
    {
      "word": "起床",
      "pinyin": "qǐchuáng",
      "meaning": "thức dậy",
      "example": "七点起床。",
      "examplePinyin": "Qī diǎn qǐchuáng.",
      "fromType": "Động từ",
      "trans": "Bảy giờ thức dậy."
    },
    {
      "word": "午饭",
      "pinyin": "wǔfàn",
      "meaning": "bữa trưa",
      "example": "吃午饭了。",
      "examplePinyin": "Chī wǔfàn le.",
      "fromType": "Danh từ",
      "trans": "Ăn trưa rồi."
    },
    {
      "word": "晚饭",
      "pinyin": "wǎnfàn",
      "meaning": "bữa tối",
      "example": "吃晚饭。",
      "examplePinyin": "Chī wǎnfàn.",
      "fromType": "Danh từ",
      "trans": "Ăn bữa tối."
    },
    {
      "word": "外边",
      "pinyin": "wàibian",
      "meaning": "phía ngoài",
      "example": "他在外边。",
      "examplePinyin": "Tā zài wàibian.",
      "fromType": "Danh từ",
      "trans": "Anh ấy ở phía ngoài."
    },
    {
      "word": "里面",
      "pinyin": "lǐmiàn",
      "meaning": "bên trong",
      "example": "盒子里里面是什么？",
      "examplePinyin": "hézi lǐmiàn shì shénme?",
      "fromType": "Danh từ",
      "trans": "Bên trong cái hộp là gì?"
    },
    {
      "word": "洗",
      "pinyin": "xǐ",
      "meaning": "rửa",
      "example": "洗手。",
      "examplePinyin": "xǐ shǒu.",
      "fromType": "Động từ",
      "trans": "Rửa tay."
    },
    {
      "word": "做饭",
      "pinyin": "zuò fàn",
      "meaning": "nấu ăn",
      "example": "我在做饭。",
      "examplePinyin": "Wǒ zài zuò fàn.",
      "fromType": "Động từ",
      "trans": "Tôi đang nấu ăn."
    },
    {
      "word": "打扫",
      "pinyin": "dǎsǎo",
      "meaning": "dọn dẹp",
      "example": "打扫房间。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Dọn dẹp phòng."
    },
    {
      "word": "住",
      "pinyin": "zhù",
      "meaning": "ở",
      "example": "我住在这里。",
      "examplePinyin": "Wǒ zhù zài zhèlǐ.",
      "fromType": "Động từ",
      "trans": "Tôi sống ở đây."
    },
    {
      "word": "生活",
      "pinyin": "shēnghuó",
      "meaning": "cuộc sống",
      "example": "生活快乐。",
      "examplePinyin": "",
      "fromType": "danh từ / động từ",
      "trans": "Cuộc sống vui vẻ."
    }
  ],
  "thien_nhien_thoi_tiet": [
    {
      "word": "天气",
      "pinyin": "tiānqì",
      "meaning": "thời tiết",
      "example": "天气怎么样？",
      "examplePinyin": "Tiānqì zěnmeyàng?",
      "fromType": "Danh từ",
      "trans": "Thời tiết thế nào?"
    },
    {
      "word": "天",
      "pinyin": "tiān",
      "meaning": "ngày, trời",
      "example": "今天天气很好。",
      "examplePinyin": "Jīntiān tiānqì hěn hǎo.",
      "fromType": "Danh/Lượng",
      "trans": "Thời tiết hôm nay rất tốt."
    },
    {
      "word": "下雨",
      "pinyin": "xià yǔ",
      "meaning": "mưa",
      "example": "外面下雨了。",
      "examplePinyin": "Wàimiàn xià yǔ le.",
      "fromType": "Động từ",
      "trans": "Bên ngoài mưa rồi."
    },
    {
      "word": "热",
      "pinyin": "rè",
      "meaning": "nóng",
      "example": "今天很热。",
      "examplePinyin": "Jīntiān hěn rè.",
      "fromType": "Tính từ",
      "trans": "Hôm nay rất nóng."
    },
    {
      "word": "冷",
      "pinyin": "lěng",
      "meaning": "lạnh",
      "example": "今天很冷。",
      "examplePinyin": "Jīntiān hěn lěng.",
      "fromType": "Tính từ",
      "trans": "Hôm nay rất lạnh."
    },
    {
      "word": "风",
      "pinyin": "fēng",
      "meaning": "gió",
      "example": "风很大。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Gió rất lớn."
    },
    {
      "word": "雪",
      "pinyin": "xuě",
      "meaning": "tuyết",
      "example": "下雪了。",
      "examplePinyin": "Xià xuě le.",
      "fromType": "Danh từ",
      "trans": "Tuyết rơi rồi."
    },
    {
      "word": "太阳",
      "pinyin": "tàiyáng",
      "meaning": "mặt trời",
      "example": "太阳出来了。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Mặt trời mọc rồi."
    },
    {
      "word": "月亮",
      "pinyin": "yuèliang",
      "meaning": "mặt trăng",
      "example": "月亮圆了。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Trăng tròn rồi."
    },
    {
      "word": "水",
      "pinyin": "shuǐ",
      "meaning": "nước",
      "example": "喝水。",
      "examplePinyin": "Hē shuǐ.",
      "fromType": "Danh từ",
      "trans": "Uống nước."
    },
    {
      "word": "火",
      "pinyin": "huǒ",
      "meaning": "lửa, nóng nảy, nổi tiếng",
      "example": "最近我们的生意很火。",
      "examplePinyin": "",
      "fromType": "n./adj.",
      "trans": "Dạo này công việc kinh doanh của chúng tôi rất đắt khách."
    },
    {
      "word": "山",
      "pinyin": "shān",
      "meaning": "núi",
      "example": "那座山。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Ngọn núi đó."
    },
    {
      "word": "河",
      "pinyin": "hé",
      "meaning": "sông",
      "example": "那条河。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Dòng sông đó."
    },
    {
      "word": "海",
      "pinyin": "hǎi",
      "meaning": "biển",
      "example": "去看海。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Đi xem biển."
    },
    {
      "word": "树",
      "pinyin": "shù",
      "meaning": "cây",
      "example": "种树。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Trồng cây."
    },
    {
      "word": "花",
      "pinyin": "huā",
      "meaning": "hoa",
      "example": "这朵花很香。",
      "examplePinyin": "zhè duǒ huā hěn xiāng.",
      "fromType": "Danh từ",
      "trans": "Bông hoa này rất thơm."
    },
    {
      "word": "动物",
      "pinyin": "dòngwù",
      "meaning": "động vật",
      "example": "保护动物。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Bảo vệ động vật."
    },
    {
      "word": "猫",
      "pinyin": "māo",
      "meaning": "mèo",
      "example": "小猫很可爱。",
      "examplePinyin": "Xiǎo māo hěn kě'ài.",
      "fromType": "Danh từ",
      "trans": "Chú mèo con rất đáng yêu."
    },
    {
      "word": "狗",
      "pinyin": "gǒu",
      "meaning": "chó",
      "example": "我有一只小狗。",
      "examplePinyin": "Wǒ yǒu yī zhī xiǎo gǒu.",
      "fromType": "Danh từ",
      "trans": "Tôi có một con chó nhỏ."
    },
    {
      "word": "鸟",
      "pinyin": "niǎo",
      "meaning": "chim",
      "example": "小鸟。",
      "examplePinyin": "xiǎo niǎo.",
      "fromType": "Danh từ",
      "trans": "Con chim nhỏ."
    }
  ],
  "giai_tri_so_thich": [
    {
      "word": "玩",
      "pinyin": "wán",
      "meaning": "chơi",
      "example": "去玩。",
      "examplePinyin": "Qù wán.",
      "fromType": "Động từ",
      "trans": "Đi chơi."
    },
    {
      "word": "好玩儿",
      "pinyin": "hǎowánr",
      "meaning": "thú vị",
      "example": "这儿很好玩儿。",
      "examplePinyin": "Zhèr hěn hǎowánr.",
      "fromType": "Tính từ",
      "trans": "Ở đây rất thú vị."
    },
    {
      "word": "电影",
      "pinyin": "diànyǐng",
      "meaning": "phim",
      "example": "这个电影很好看。",
      "examplePinyin": "Zhège diànyǐng hěn hǎokàn.",
      "fromType": "Danh từ",
      "trans": "Bộ phim này rất hay."
    },
    {
      "word": "电影院",
      "pinyin": "diànyǐngyuàn",
      "meaning": "rạp chiếu phim",
      "example": "我们去电影院吧。",
      "examplePinyin": "Wǒmen qù diànyǐngyuàn ba.",
      "fromType": "Danh từ",
      "trans": "Chúng ta đi rạp chiếu phim nhé."
    },
    {
      "word": "电视",
      "pinyin": "diànshì",
      "meaning": "tivi",
      "example": "看电视。",
      "examplePinyin": "Kàn diànshì.",
      "fromType": "Danh từ",
      "trans": "Xem tivi."
    },
    {
      "word": "音乐",
      "pinyin": "yīnyuè",
      "meaning": "âm nhạc",
      "example": "听音乐。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Nghe nhạc."
    },
    {
      "word": "歌",
      "pinyin": "gē",
      "meaning": "bài hát",
      "example": "这首歌很好听。",
      "examplePinyin": "Zhè shǒu gē hěn hǎotīng.",
      "fromType": "Danh từ",
      "trans": "Bài hát này rất hay."
    },
    {
      "word": "唱",
      "pinyin": "chàng",
      "meaning": "hát",
      "example": "你会唱中文歌吗？",
      "examplePinyin": "Nǐ huì chàng Zhōngwén gē ma?",
      "fromType": "Động từ",
      "trans": "Bạn biết hát bài hát tiếng Trung không?"
    },
    {
      "word": "听",
      "pinyin": "tīng",
      "meaning": "nghe",
      "example": "听音乐。",
      "examplePinyin": "Tīng yīnyuè.",
      "fromType": "Động từ",
      "trans": "Nghe nhạc."
    },
    {
      "word": "看",
      "pinyin": "kàn",
      "meaning": "nhìn, xem",
      "example": "看电影。",
      "examplePinyin": "Kàn diànyǐng.",
      "fromType": "Động từ",
      "trans": "Xem phim."
    },
    {
      "word": "游戏",
      "pinyin": "yóuxì",
      "meaning": "trò chơi",
      "example": "玩游戏。",
      "examplePinyin": "",
      "fromType": "danh từ",
      "trans": "Chơi trò chơi."
    },
    {
      "word": "运动",
      "pinyin": "yùndòng",
      "meaning": "vận động",
      "example": "我喜欢运动。",
      "examplePinyin": "wǒ xǐhuān yùndòng.",
      "fromType": "Động từ",
      "trans": "Tôi thích vận động."
    },
    {
      "word": "跑步",
      "pinyin": "pǎobù",
      "meaning": "chạy bộ",
      "example": "我喜欢跑步。",
      "examplePinyin": "wǒ xǐhuān pǎobù.",
      "fromType": "Động từ",
      "trans": "Tôi thích chạy bộ."
    },
    {
      "word": "旅游",
      "pinyin": "lǚyóu",
      "meaning": "du lịch",
      "example": "我想去旅游。",
      "examplePinyin": "wǒ xiǎng qù lǚyóu.",
      "fromType": "Động từ",
      "trans": "Tôi muốn đi du lịch."
    },
    {
      "word": "拍照",
      "pinyin": "pāizhào",
      "meaning": "chụp ảnh",
      "example": "给我拍照。",
      "examplePinyin": "",
      "fromType": "động từ",
      "trans": "Chụp ảnh cho tôi."
    },
    {
      "word": "跳舞",
      "pinyin": "tiàowǔ",
      "meaning": "nhảy múa",
      "example": "她喜欢跳舞。",
      "examplePinyin": "tā xǐhuān tiàowǔ.",
      "fromType": "Động từ",
      "trans": "Cô ấy thích nhảy múa."
    },
    {
      "word": "喜欢",
      "pinyin": "xǐhuan",
      "meaning": "thích",
      "example": "我喜欢看电影。",
      "examplePinyin": "Wǒ xǐhuan kàn diànyǐng.",
      "fromType": "Động từ",
      "trans": "Tôi thích xem phim."
    },
    {
      "word": "爱",
      "pinyin": "ài",
      "meaning": "yêu, thích",
      "example": "我爱吃米饭。",
      "examplePinyin": "Wǒ ài chī mǐfàn.",
      "fromType": "Động từ",
      "trans": "Tôi thích ăn cơm."
    }
  ],
  "chuyen_nganh_logistics_tmdt": [
    {
      "word": "订单管理",
      "pinyin": "dìngdān guǎnlǐ",
      "meaning": "quản lý đơn hàng",
      "example": "我们需要订单管理。",
      "examplePinyin": "Wǒmen xūyào dìngdān guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý đơn hàng."
    },
    {
      "word": "订单处理",
      "pinyin": "dìngdān chǔlǐ",
      "meaning": "xử lý đơn hàng",
      "example": "我们需要订单处理。",
      "examplePinyin": "Wǒmen xūyào dìngdān chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý đơn hàng."
    },
    {
      "word": "订单分析",
      "pinyin": "dìngdān fēnxī",
      "meaning": "phân tích đơn hàng",
      "example": "我们需要订单分析。",
      "examplePinyin": "Wǒmen xūyào dìngdān fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích đơn hàng."
    },
    {
      "word": "订单检查",
      "pinyin": "dìngdān jiǎnchá",
      "meaning": "kiểm tra đơn hàng",
      "example": "我们需要订单检查。",
      "examplePinyin": "Wǒmen xūyào dìngdān jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra đơn hàng."
    },
    {
      "word": "订单记录",
      "pinyin": "dìngdān jìlù",
      "meaning": "ghi chép đơn hàng",
      "example": "我们需要订单记录。",
      "examplePinyin": "Wǒmen xūyào dìngdān jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép đơn hàng."
    },
    {
      "word": "订单设置",
      "pinyin": "dìngdān shèzhì",
      "meaning": "cài đặt đơn hàng",
      "example": "我们需要订单设置。",
      "examplePinyin": "Wǒmen xūyào dìngdān shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt đơn hàng."
    },
    {
      "word": "订单更新",
      "pinyin": "dìngdān gēngxīn",
      "meaning": "cập nhật đơn hàng",
      "example": "我们需要订单更新。",
      "examplePinyin": "Wǒmen xūyào dìngdān gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật đơn hàng."
    },
    {
      "word": "订单优化",
      "pinyin": "dìngdān yōuhuà",
      "meaning": "tối ưu hóa đơn hàng",
      "example": "我们需要订单优化。",
      "examplePinyin": "Wǒmen xūyào dìngdān yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa đơn hàng."
    },
    {
      "word": "订单导入",
      "pinyin": "dìngdān dǎorù",
      "meaning": "nhập vào đơn hàng",
      "example": "我们需要订单导入。",
      "examplePinyin": "Wǒmen xūyào dìngdān dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào đơn hàng."
    },
    {
      "word": "订单导出",
      "pinyin": "dìngdān dǎochū",
      "meaning": "xuất ra đơn hàng",
      "example": "我们需要订单导出。",
      "examplePinyin": "Wǒmen xūyào dìngdān dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra đơn hàng."
    },
    {
      "word": "订单备份",
      "pinyin": "dìngdān bèifèn",
      "meaning": "sao lưu đơn hàng",
      "example": "我们需要订单备份。",
      "examplePinyin": "Wǒmen xūyào dìngdān bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu đơn hàng."
    },
    {
      "word": "订单同步",
      "pinyin": "dìngdān tóngbù",
      "meaning": "đồng bộ đơn hàng",
      "example": "我们需要订单同步。",
      "examplePinyin": "Wǒmen xūyào dìngdān tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ đơn hàng."
    },
    {
      "word": "订单搜索",
      "pinyin": "dìngdān sōusuǒ",
      "meaning": "tìm kiếm đơn hàng",
      "example": "我们需要订单搜索。",
      "examplePinyin": "Wǒmen xūyào dìngdān sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm đơn hàng."
    },
    {
      "word": "订单分类",
      "pinyin": "dìngdān fēnlèi",
      "meaning": "phân loại đơn hàng",
      "example": "我们需要订单分类。",
      "examplePinyin": "Wǒmen xūyào dìngdān fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại đơn hàng."
    },
    {
      "word": "订单统计",
      "pinyin": "dìngdān tǒngjì",
      "meaning": "thống kê đơn hàng",
      "example": "我们需要订单统计。",
      "examplePinyin": "Wǒmen xūyào dìngdān tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê đơn hàng."
    },
    {
      "word": "订单确认",
      "pinyin": "dìngdān quèrèn",
      "meaning": "xác nhận đơn hàng",
      "example": "我们需要订单确认。",
      "examplePinyin": "Wǒmen xūyào dìngdān quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận đơn hàng."
    },
    {
      "word": "订单审核",
      "pinyin": "dìngdān shěnhé",
      "meaning": "duyệt/kiểm duyệt đơn hàng",
      "example": "我们需要订单审核。",
      "examplePinyin": "Wǒmen xūyào dìngdān shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt đơn hàng."
    },
    {
      "word": "订单测试",
      "pinyin": "dìngdān cèshì",
      "meaning": "kiểm thử đơn hàng",
      "example": "我们需要订单测试。",
      "examplePinyin": "Wǒmen xūyào dìngdān cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử đơn hàng."
    },
    {
      "word": "订单维护",
      "pinyin": "dìngdān wéihù",
      "meaning": "bảo trì đơn hàng",
      "example": "我们需要订单维护。",
      "examplePinyin": "Wǒmen xūyào dìngdān wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì đơn hàng."
    },
    {
      "word": "订单设计",
      "pinyin": "dìngdān shèjì",
      "meaning": "thiết kế đơn hàng",
      "example": "我们需要订单设计。",
      "examplePinyin": "Wǒmen xūyào dìngdān shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế đơn hàng."
    },
    {
      "word": "订单开发",
      "pinyin": "dìngdān kāifā",
      "meaning": "phát triển đơn hàng",
      "example": "我们需要订单开发。",
      "examplePinyin": "Wǒmen xūyào dìngdān kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển đơn hàng."
    },
    {
      "word": "订单训练",
      "pinyin": "dìngdān xùnliàn",
      "meaning": "huấn luyện đơn hàng",
      "example": "我们需要订单训练。",
      "examplePinyin": "Wǒmen xūyào dìngdān xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện đơn hàng."
    },
    {
      "word": "订单识别",
      "pinyin": "dìngdān shíbié",
      "meaning": "nhận dạng đơn hàng",
      "example": "我们需要订单识别。",
      "examplePinyin": "Wǒmen xūyào dìngdān shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng đơn hàng."
    },
    {
      "word": "订单生成",
      "pinyin": "dìngdān shēngchéng",
      "meaning": "tạo sinh đơn hàng",
      "example": "我们需要订单生成。",
      "examplePinyin": "Wǒmen xūyào dìngdān shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh đơn hàng."
    },
    {
      "word": "订单通知",
      "pinyin": "dìngdān tōngzhī",
      "meaning": "thông báo đơn hàng",
      "example": "我们需要订单通知。",
      "examplePinyin": "Wǒmen xūyào dìngdān tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo đơn hàng."
    },
    {
      "word": "订单权限",
      "pinyin": "dìngdān quánxiàn",
      "meaning": "quyền hạn đơn hàng",
      "example": "我们需要订单权限。",
      "examplePinyin": "Wǒmen xūyào dìngdān quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn đơn hàng."
    },
    {
      "word": "订单状态",
      "pinyin": "dìngdān zhuàngtài",
      "meaning": "trạng thái đơn hàng",
      "example": "我们需要订单状态。",
      "examplePinyin": "Wǒmen xūyào dìngdān zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái đơn hàng."
    },
    {
      "word": "订单编号",
      "pinyin": "dìngdān biānhào",
      "meaning": "mã số đơn hàng",
      "example": "我们需要订单编号。",
      "examplePinyin": "Wǒmen xūyào dìngdān biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số đơn hàng."
    },
    {
      "word": "订单模板",
      "pinyin": "dìngdān múbǎn",
      "meaning": "mẫu/template đơn hàng",
      "example": "我们需要订单模板。",
      "examplePinyin": "Wǒmen xūyào dìngdān múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template đơn hàng."
    },
    {
      "word": "订单异常",
      "pinyin": "dìngdān yìcháng",
      "meaning": "bất thường/lỗi đơn hàng",
      "example": "我们需要订单异常。",
      "examplePinyin": "Wǒmen xūyào dìngdān yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi đơn hàng."
    },
    {
      "word": "商品管理",
      "pinyin": "shāngpǐn guǎnlǐ",
      "meaning": "quản lý sản phẩm",
      "example": "我们需要商品管理。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý sản phẩm."
    },
    {
      "word": "商品处理",
      "pinyin": "shāngpǐn chǔlǐ",
      "meaning": "xử lý sản phẩm",
      "example": "我们需要商品处理。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý sản phẩm."
    },
    {
      "word": "商品分析",
      "pinyin": "shāngpǐn fēnxī",
      "meaning": "phân tích sản phẩm",
      "example": "我们需要商品分析。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích sản phẩm."
    },
    {
      "word": "商品检查",
      "pinyin": "shāngpǐn jiǎnchá",
      "meaning": "kiểm tra sản phẩm",
      "example": "我们需要商品检查。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra sản phẩm."
    },
    {
      "word": "商品记录",
      "pinyin": "shāngpǐn jìlù",
      "meaning": "ghi chép sản phẩm",
      "example": "我们需要商品记录。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép sản phẩm."
    },
    {
      "word": "商品设置",
      "pinyin": "shāngpǐn shèzhì",
      "meaning": "cài đặt sản phẩm",
      "example": "我们需要商品设置。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt sản phẩm."
    },
    {
      "word": "商品更新",
      "pinyin": "shāngpǐn gēngxīn",
      "meaning": "cập nhật sản phẩm",
      "example": "我们需要商品更新。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật sản phẩm."
    },
    {
      "word": "商品优化",
      "pinyin": "shāngpǐn yōuhuà",
      "meaning": "tối ưu hóa sản phẩm",
      "example": "我们需要商品优化。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa sản phẩm."
    },
    {
      "word": "商品导入",
      "pinyin": "shāngpǐn dǎorù",
      "meaning": "nhập vào sản phẩm",
      "example": "我们需要商品导入。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào sản phẩm."
    },
    {
      "word": "商品导出",
      "pinyin": "shāngpǐn dǎochū",
      "meaning": "xuất ra sản phẩm",
      "example": "我们需要商品导出。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra sản phẩm."
    },
    {
      "word": "商品备份",
      "pinyin": "shāngpǐn bèifèn",
      "meaning": "sao lưu sản phẩm",
      "example": "我们需要商品备份。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu sản phẩm."
    },
    {
      "word": "商品同步",
      "pinyin": "shāngpǐn tóngbù",
      "meaning": "đồng bộ sản phẩm",
      "example": "我们需要商品同步。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ sản phẩm."
    },
    {
      "word": "商品搜索",
      "pinyin": "shāngpǐn sōusuǒ",
      "meaning": "tìm kiếm sản phẩm",
      "example": "我们需要商品搜索。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm sản phẩm."
    },
    {
      "word": "商品分类",
      "pinyin": "shāngpǐn fēnlèi",
      "meaning": "phân loại sản phẩm",
      "example": "我们需要商品分类。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại sản phẩm."
    },
    {
      "word": "商品统计",
      "pinyin": "shāngpǐn tǒngjì",
      "meaning": "thống kê sản phẩm",
      "example": "我们需要商品统计。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê sản phẩm."
    },
    {
      "word": "商品确认",
      "pinyin": "shāngpǐn quèrèn",
      "meaning": "xác nhận sản phẩm",
      "example": "我们需要商品确认。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận sản phẩm."
    },
    {
      "word": "商品审核",
      "pinyin": "shāngpǐn shěnhé",
      "meaning": "duyệt/kiểm duyệt sản phẩm",
      "example": "我们需要商品审核。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt sản phẩm."
    },
    {
      "word": "商品测试",
      "pinyin": "shāngpǐn cèshì",
      "meaning": "kiểm thử sản phẩm",
      "example": "我们需要商品测试。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử sản phẩm."
    },
    {
      "word": "商品维护",
      "pinyin": "shāngpǐn wéihù",
      "meaning": "bảo trì sản phẩm",
      "example": "我们需要商品维护。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì sản phẩm."
    },
    {
      "word": "商品设计",
      "pinyin": "shāngpǐn shèjì",
      "meaning": "thiết kế sản phẩm",
      "example": "我们需要商品设计。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế sản phẩm."
    },
    {
      "word": "商品开发",
      "pinyin": "shāngpǐn kāifā",
      "meaning": "phát triển sản phẩm",
      "example": "我们需要商品开发。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển sản phẩm."
    },
    {
      "word": "商品训练",
      "pinyin": "shāngpǐn xùnliàn",
      "meaning": "huấn luyện sản phẩm",
      "example": "我们需要商品训练。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện sản phẩm."
    },
    {
      "word": "商品识别",
      "pinyin": "shāngpǐn shíbié",
      "meaning": "nhận dạng sản phẩm",
      "example": "我们需要商品识别。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng sản phẩm."
    },
    {
      "word": "商品生成",
      "pinyin": "shāngpǐn shēngchéng",
      "meaning": "tạo sinh sản phẩm",
      "example": "我们需要商品生成。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh sản phẩm."
    },
    {
      "word": "商品通知",
      "pinyin": "shāngpǐn tōngzhī",
      "meaning": "thông báo sản phẩm",
      "example": "我们需要商品通知。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo sản phẩm."
    },
    {
      "word": "商品权限",
      "pinyin": "shāngpǐn quánxiàn",
      "meaning": "quyền hạn sản phẩm",
      "example": "我们需要商品权限。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn sản phẩm."
    },
    {
      "word": "商品状态",
      "pinyin": "shāngpǐn zhuàngtài",
      "meaning": "trạng thái sản phẩm",
      "example": "我们需要商品状态。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái sản phẩm."
    },
    {
      "word": "商品编号",
      "pinyin": "shāngpǐn biānhào",
      "meaning": "mã số sản phẩm",
      "example": "我们需要商品编号。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số sản phẩm."
    },
    {
      "word": "商品模板",
      "pinyin": "shāngpǐn múbǎn",
      "meaning": "mẫu/template sản phẩm",
      "example": "我们需要商品模板。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template sản phẩm."
    },
    {
      "word": "商品异常",
      "pinyin": "shāngpǐn yìcháng",
      "meaning": "bất thường/lỗi sản phẩm",
      "example": "我们需要商品异常。",
      "examplePinyin": "Wǒmen xūyào shāngpǐn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi sản phẩm."
    },
    {
      "word": "客户管理",
      "pinyin": "kèhù guǎnlǐ",
      "meaning": "quản lý khách hàng",
      "example": "我们需要客户管理。",
      "examplePinyin": "Wǒmen xūyào kèhù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý khách hàng."
    },
    {
      "word": "客户处理",
      "pinyin": "kèhù chǔlǐ",
      "meaning": "xử lý khách hàng",
      "example": "我们需要客户处理。",
      "examplePinyin": "Wǒmen xūyào kèhù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý khách hàng."
    },
    {
      "word": "客户分析",
      "pinyin": "kèhù fēnxī",
      "meaning": "phân tích khách hàng",
      "example": "我们需要客户分析。",
      "examplePinyin": "Wǒmen xūyào kèhù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích khách hàng."
    },
    {
      "word": "客户检查",
      "pinyin": "kèhù jiǎnchá",
      "meaning": "kiểm tra khách hàng",
      "example": "我们需要客户检查。",
      "examplePinyin": "Wǒmen xūyào kèhù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra khách hàng."
    },
    {
      "word": "客户记录",
      "pinyin": "kèhù jìlù",
      "meaning": "ghi chép khách hàng",
      "example": "我们需要客户记录。",
      "examplePinyin": "Wǒmen xūyào kèhù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép khách hàng."
    },
    {
      "word": "客户设置",
      "pinyin": "kèhù shèzhì",
      "meaning": "cài đặt khách hàng",
      "example": "我们需要客户设置。",
      "examplePinyin": "Wǒmen xūyào kèhù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt khách hàng."
    },
    {
      "word": "客户更新",
      "pinyin": "kèhù gēngxīn",
      "meaning": "cập nhật khách hàng",
      "example": "我们需要客户更新。",
      "examplePinyin": "Wǒmen xūyào kèhù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật khách hàng."
    },
    {
      "word": "客户优化",
      "pinyin": "kèhù yōuhuà",
      "meaning": "tối ưu hóa khách hàng",
      "example": "我们需要客户优化。",
      "examplePinyin": "Wǒmen xūyào kèhù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa khách hàng."
    },
    {
      "word": "客户导入",
      "pinyin": "kèhù dǎorù",
      "meaning": "nhập vào khách hàng",
      "example": "我们需要客户导入。",
      "examplePinyin": "Wǒmen xūyào kèhù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào khách hàng."
    },
    {
      "word": "客户导出",
      "pinyin": "kèhù dǎochū",
      "meaning": "xuất ra khách hàng",
      "example": "我们需要客户导出。",
      "examplePinyin": "Wǒmen xūyào kèhù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra khách hàng."
    },
    {
      "word": "客户备份",
      "pinyin": "kèhù bèifèn",
      "meaning": "sao lưu khách hàng",
      "example": "我们需要客户备份。",
      "examplePinyin": "Wǒmen xūyào kèhù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu khách hàng."
    },
    {
      "word": "客户同步",
      "pinyin": "kèhù tóngbù",
      "meaning": "đồng bộ khách hàng",
      "example": "我们需要客户同步。",
      "examplePinyin": "Wǒmen xūyào kèhù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ khách hàng."
    },
    {
      "word": "客户搜索",
      "pinyin": "kèhù sōusuǒ",
      "meaning": "tìm kiếm khách hàng",
      "example": "我们需要客户搜索。",
      "examplePinyin": "Wǒmen xūyào kèhù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm khách hàng."
    },
    {
      "word": "客户分类",
      "pinyin": "kèhù fēnlèi",
      "meaning": "phân loại khách hàng",
      "example": "我们需要客户分类。",
      "examplePinyin": "Wǒmen xūyào kèhù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại khách hàng."
    },
    {
      "word": "客户统计",
      "pinyin": "kèhù tǒngjì",
      "meaning": "thống kê khách hàng",
      "example": "我们需要客户统计。",
      "examplePinyin": "Wǒmen xūyào kèhù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê khách hàng."
    },
    {
      "word": "客户确认",
      "pinyin": "kèhù quèrèn",
      "meaning": "xác nhận khách hàng",
      "example": "我们需要客户确认。",
      "examplePinyin": "Wǒmen xūyào kèhù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận khách hàng."
    },
    {
      "word": "客户审核",
      "pinyin": "kèhù shěnhé",
      "meaning": "duyệt/kiểm duyệt khách hàng",
      "example": "我们需要客户审核。",
      "examplePinyin": "Wǒmen xūyào kèhù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt khách hàng."
    },
    {
      "word": "客户测试",
      "pinyin": "kèhù cèshì",
      "meaning": "kiểm thử khách hàng",
      "example": "我们需要客户测试。",
      "examplePinyin": "Wǒmen xūyào kèhù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử khách hàng."
    },
    {
      "word": "客户维护",
      "pinyin": "kèhù wéihù",
      "meaning": "bảo trì khách hàng",
      "example": "我们需要客户维护。",
      "examplePinyin": "Wǒmen xūyào kèhù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì khách hàng."
    },
    {
      "word": "客户设计",
      "pinyin": "kèhù shèjì",
      "meaning": "thiết kế khách hàng",
      "example": "我们需要客户设计。",
      "examplePinyin": "Wǒmen xūyào kèhù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế khách hàng."
    },
    {
      "word": "客户开发",
      "pinyin": "kèhù kāifā",
      "meaning": "phát triển khách hàng",
      "example": "我们需要客户开发。",
      "examplePinyin": "Wǒmen xūyào kèhù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển khách hàng."
    },
    {
      "word": "客户训练",
      "pinyin": "kèhù xùnliàn",
      "meaning": "huấn luyện khách hàng",
      "example": "我们需要客户训练。",
      "examplePinyin": "Wǒmen xūyào kèhù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện khách hàng."
    },
    {
      "word": "客户识别",
      "pinyin": "kèhù shíbié",
      "meaning": "nhận dạng khách hàng",
      "example": "我们需要客户识别。",
      "examplePinyin": "Wǒmen xūyào kèhù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng khách hàng."
    },
    {
      "word": "客户生成",
      "pinyin": "kèhù shēngchéng",
      "meaning": "tạo sinh khách hàng",
      "example": "我们需要客户生成。",
      "examplePinyin": "Wǒmen xūyào kèhù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh khách hàng."
    },
    {
      "word": "客户通知",
      "pinyin": "kèhù tōngzhī",
      "meaning": "thông báo khách hàng",
      "example": "我们需要客户通知。",
      "examplePinyin": "Wǒmen xūyào kèhù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo khách hàng."
    },
    {
      "word": "客户权限",
      "pinyin": "kèhù quánxiàn",
      "meaning": "quyền hạn khách hàng",
      "example": "我们需要客户权限。",
      "examplePinyin": "Wǒmen xūyào kèhù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn khách hàng."
    },
    {
      "word": "客户状态",
      "pinyin": "kèhù zhuàngtài",
      "meaning": "trạng thái khách hàng",
      "example": "我们需要客户状态。",
      "examplePinyin": "Wǒmen xūyào kèhù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái khách hàng."
    },
    {
      "word": "客户编号",
      "pinyin": "kèhù biānhào",
      "meaning": "mã số khách hàng",
      "example": "我们需要客户编号。",
      "examplePinyin": "Wǒmen xūyào kèhù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số khách hàng."
    },
    {
      "word": "客户模板",
      "pinyin": "kèhù múbǎn",
      "meaning": "mẫu/template khách hàng",
      "example": "我们需要客户模板。",
      "examplePinyin": "Wǒmen xūyào kèhù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template khách hàng."
    },
    {
      "word": "客户异常",
      "pinyin": "kèhù yìcháng",
      "meaning": "bất thường/lỗi khách hàng",
      "example": "我们需要客户异常。",
      "examplePinyin": "Wǒmen xūyào kèhù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi khách hàng."
    },
    {
      "word": "店铺管理",
      "pinyin": "diànpù guǎnlǐ",
      "meaning": "quản lý cửa hàng",
      "example": "我们需要店铺管理。",
      "examplePinyin": "Wǒmen xūyào diànpù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý cửa hàng."
    },
    {
      "word": "店铺处理",
      "pinyin": "diànpù chǔlǐ",
      "meaning": "xử lý cửa hàng",
      "example": "我们需要店铺处理。",
      "examplePinyin": "Wǒmen xūyào diànpù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý cửa hàng."
    },
    {
      "word": "店铺分析",
      "pinyin": "diànpù fēnxī",
      "meaning": "phân tích cửa hàng",
      "example": "我们需要店铺分析。",
      "examplePinyin": "Wǒmen xūyào diànpù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích cửa hàng."
    },
    {
      "word": "店铺检查",
      "pinyin": "diànpù jiǎnchá",
      "meaning": "kiểm tra cửa hàng",
      "example": "我们需要店铺检查。",
      "examplePinyin": "Wǒmen xūyào diànpù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra cửa hàng."
    },
    {
      "word": "店铺记录",
      "pinyin": "diànpù jìlù",
      "meaning": "ghi chép cửa hàng",
      "example": "我们需要店铺记录。",
      "examplePinyin": "Wǒmen xūyào diànpù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép cửa hàng."
    },
    {
      "word": "店铺设置",
      "pinyin": "diànpù shèzhì",
      "meaning": "cài đặt cửa hàng",
      "example": "我们需要店铺设置。",
      "examplePinyin": "Wǒmen xūyào diànpù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt cửa hàng."
    },
    {
      "word": "店铺更新",
      "pinyin": "diànpù gēngxīn",
      "meaning": "cập nhật cửa hàng",
      "example": "我们需要店铺更新。",
      "examplePinyin": "Wǒmen xūyào diànpù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật cửa hàng."
    },
    {
      "word": "店铺优化",
      "pinyin": "diànpù yōuhuà",
      "meaning": "tối ưu hóa cửa hàng",
      "example": "我们需要店铺优化。",
      "examplePinyin": "Wǒmen xūyào diànpù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa cửa hàng."
    },
    {
      "word": "店铺导入",
      "pinyin": "diànpù dǎorù",
      "meaning": "nhập vào cửa hàng",
      "example": "我们需要店铺导入。",
      "examplePinyin": "Wǒmen xūyào diànpù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào cửa hàng."
    },
    {
      "word": "店铺导出",
      "pinyin": "diànpù dǎochū",
      "meaning": "xuất ra cửa hàng",
      "example": "我们需要店铺导出。",
      "examplePinyin": "Wǒmen xūyào diànpù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra cửa hàng."
    },
    {
      "word": "店铺备份",
      "pinyin": "diànpù bèifèn",
      "meaning": "sao lưu cửa hàng",
      "example": "我们需要店铺备份。",
      "examplePinyin": "Wǒmen xūyào diànpù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu cửa hàng."
    },
    {
      "word": "店铺同步",
      "pinyin": "diànpù tóngbù",
      "meaning": "đồng bộ cửa hàng",
      "example": "我们需要店铺同步。",
      "examplePinyin": "Wǒmen xūyào diànpù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ cửa hàng."
    },
    {
      "word": "店铺搜索",
      "pinyin": "diànpù sōusuǒ",
      "meaning": "tìm kiếm cửa hàng",
      "example": "我们需要店铺搜索。",
      "examplePinyin": "Wǒmen xūyào diànpù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm cửa hàng."
    },
    {
      "word": "店铺分类",
      "pinyin": "diànpù fēnlèi",
      "meaning": "phân loại cửa hàng",
      "example": "我们需要店铺分类。",
      "examplePinyin": "Wǒmen xūyào diànpù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại cửa hàng."
    },
    {
      "word": "店铺统计",
      "pinyin": "diànpù tǒngjì",
      "meaning": "thống kê cửa hàng",
      "example": "我们需要店铺统计。",
      "examplePinyin": "Wǒmen xūyào diànpù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê cửa hàng."
    },
    {
      "word": "店铺确认",
      "pinyin": "diànpù quèrèn",
      "meaning": "xác nhận cửa hàng",
      "example": "我们需要店铺确认。",
      "examplePinyin": "Wǒmen xūyào diànpù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận cửa hàng."
    },
    {
      "word": "店铺审核",
      "pinyin": "diànpù shěnhé",
      "meaning": "duyệt/kiểm duyệt cửa hàng",
      "example": "我们需要店铺审核。",
      "examplePinyin": "Wǒmen xūyào diànpù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt cửa hàng."
    },
    {
      "word": "店铺测试",
      "pinyin": "diànpù cèshì",
      "meaning": "kiểm thử cửa hàng",
      "example": "我们需要店铺测试。",
      "examplePinyin": "Wǒmen xūyào diànpù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử cửa hàng."
    },
    {
      "word": "店铺维护",
      "pinyin": "diànpù wéihù",
      "meaning": "bảo trì cửa hàng",
      "example": "我们需要店铺维护。",
      "examplePinyin": "Wǒmen xūyào diànpù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì cửa hàng."
    },
    {
      "word": "店铺设计",
      "pinyin": "diànpù shèjì",
      "meaning": "thiết kế cửa hàng",
      "example": "我们需要店铺设计。",
      "examplePinyin": "Wǒmen xūyào diànpù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế cửa hàng."
    },
    {
      "word": "店铺开发",
      "pinyin": "diànpù kāifā",
      "meaning": "phát triển cửa hàng",
      "example": "我们需要店铺开发。",
      "examplePinyin": "Wǒmen xūyào diànpù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển cửa hàng."
    },
    {
      "word": "店铺训练",
      "pinyin": "diànpù xùnliàn",
      "meaning": "huấn luyện cửa hàng",
      "example": "我们需要店铺训练。",
      "examplePinyin": "Wǒmen xūyào diànpù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện cửa hàng."
    },
    {
      "word": "店铺识别",
      "pinyin": "diànpù shíbié",
      "meaning": "nhận dạng cửa hàng",
      "example": "我们需要店铺识别。",
      "examplePinyin": "Wǒmen xūyào diànpù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng cửa hàng."
    },
    {
      "word": "店铺生成",
      "pinyin": "diànpù shēngchéng",
      "meaning": "tạo sinh cửa hàng",
      "example": "我们需要店铺生成。",
      "examplePinyin": "Wǒmen xūyào diànpù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh cửa hàng."
    },
    {
      "word": "店铺通知",
      "pinyin": "diànpù tōngzhī",
      "meaning": "thông báo cửa hàng",
      "example": "我们需要店铺通知。",
      "examplePinyin": "Wǒmen xūyào diànpù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo cửa hàng."
    },
    {
      "word": "店铺权限",
      "pinyin": "diànpù quánxiàn",
      "meaning": "quyền hạn cửa hàng",
      "example": "我们需要店铺权限。",
      "examplePinyin": "Wǒmen xūyào diànpù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn cửa hàng."
    },
    {
      "word": "店铺状态",
      "pinyin": "diànpù zhuàngtài",
      "meaning": "trạng thái cửa hàng",
      "example": "我们需要店铺状态。",
      "examplePinyin": "Wǒmen xūyào diànpù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái cửa hàng."
    },
    {
      "word": "店铺编号",
      "pinyin": "diànpù biānhào",
      "meaning": "mã số cửa hàng",
      "example": "我们需要店铺编号。",
      "examplePinyin": "Wǒmen xūyào diànpù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số cửa hàng."
    },
    {
      "word": "店铺模板",
      "pinyin": "diànpù múbǎn",
      "meaning": "mẫu/template cửa hàng",
      "example": "我们需要店铺模板。",
      "examplePinyin": "Wǒmen xūyào diànpù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template cửa hàng."
    },
    {
      "word": "店铺异常",
      "pinyin": "diànpù yìcháng",
      "meaning": "bất thường/lỗi cửa hàng",
      "example": "我们需要店铺异常。",
      "examplePinyin": "Wǒmen xūyào diànpù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi cửa hàng."
    },
    {
      "word": "库存管理",
      "pinyin": "kùcún guǎnlǐ",
      "meaning": "quản lý tồn kho",
      "example": "我们需要库存管理。",
      "examplePinyin": "Wǒmen xūyào kùcún guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tồn kho."
    },
    {
      "word": "库存处理",
      "pinyin": "kùcún chǔlǐ",
      "meaning": "xử lý tồn kho",
      "example": "我们需要库存处理。",
      "examplePinyin": "Wǒmen xūyào kùcún chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tồn kho."
    },
    {
      "word": "库存分析",
      "pinyin": "kùcún fēnxī",
      "meaning": "phân tích tồn kho",
      "example": "我们需要库存分析。",
      "examplePinyin": "Wǒmen xūyào kùcún fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tồn kho."
    },
    {
      "word": "库存检查",
      "pinyin": "kùcún jiǎnchá",
      "meaning": "kiểm tra tồn kho",
      "example": "我们需要库存检查。",
      "examplePinyin": "Wǒmen xūyào kùcún jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tồn kho."
    },
    {
      "word": "库存记录",
      "pinyin": "kùcún jìlù",
      "meaning": "ghi chép tồn kho",
      "example": "我们需要库存记录。",
      "examplePinyin": "Wǒmen xūyào kùcún jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tồn kho."
    },
    {
      "word": "库存设置",
      "pinyin": "kùcún shèzhì",
      "meaning": "cài đặt tồn kho",
      "example": "我们需要库存设置。",
      "examplePinyin": "Wǒmen xūyào kùcún shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tồn kho."
    },
    {
      "word": "库存更新",
      "pinyin": "kùcún gēngxīn",
      "meaning": "cập nhật tồn kho",
      "example": "我们需要库存更新。",
      "examplePinyin": "Wǒmen xūyào kùcún gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tồn kho."
    },
    {
      "word": "库存优化",
      "pinyin": "kùcún yōuhuà",
      "meaning": "tối ưu hóa tồn kho",
      "example": "我们需要库存优化。",
      "examplePinyin": "Wǒmen xūyào kùcún yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tồn kho."
    },
    {
      "word": "库存导入",
      "pinyin": "kùcún dǎorù",
      "meaning": "nhập vào tồn kho",
      "example": "我们需要库存导入。",
      "examplePinyin": "Wǒmen xūyào kùcún dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tồn kho."
    },
    {
      "word": "库存导出",
      "pinyin": "kùcún dǎochū",
      "meaning": "xuất ra tồn kho",
      "example": "我们需要库存导出。",
      "examplePinyin": "Wǒmen xūyào kùcún dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tồn kho."
    },
    {
      "word": "库存备份",
      "pinyin": "kùcún bèifèn",
      "meaning": "sao lưu tồn kho",
      "example": "我们需要库存备份。",
      "examplePinyin": "Wǒmen xūyào kùcún bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tồn kho."
    },
    {
      "word": "库存同步",
      "pinyin": "kùcún tóngbù",
      "meaning": "đồng bộ tồn kho",
      "example": "我们需要库存同步。",
      "examplePinyin": "Wǒmen xūyào kùcún tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tồn kho."
    },
    {
      "word": "库存搜索",
      "pinyin": "kùcún sōusuǒ",
      "meaning": "tìm kiếm tồn kho",
      "example": "我们需要库存搜索。",
      "examplePinyin": "Wǒmen xūyào kùcún sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tồn kho."
    },
    {
      "word": "库存分类",
      "pinyin": "kùcún fēnlèi",
      "meaning": "phân loại tồn kho",
      "example": "我们需要库存分类。",
      "examplePinyin": "Wǒmen xūyào kùcún fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tồn kho."
    },
    {
      "word": "库存统计",
      "pinyin": "kùcún tǒngjì",
      "meaning": "thống kê tồn kho",
      "example": "我们需要库存统计。",
      "examplePinyin": "Wǒmen xūyào kùcún tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tồn kho."
    },
    {
      "word": "库存确认",
      "pinyin": "kùcún quèrèn",
      "meaning": "xác nhận tồn kho",
      "example": "我们需要库存确认。",
      "examplePinyin": "Wǒmen xūyào kùcún quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tồn kho."
    },
    {
      "word": "库存审核",
      "pinyin": "kùcún shěnhé",
      "meaning": "duyệt/kiểm duyệt tồn kho",
      "example": "我们需要库存审核。",
      "examplePinyin": "Wǒmen xūyào kùcún shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tồn kho."
    },
    {
      "word": "库存测试",
      "pinyin": "kùcún cèshì",
      "meaning": "kiểm thử tồn kho",
      "example": "我们需要库存测试。",
      "examplePinyin": "Wǒmen xūyào kùcún cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tồn kho."
    },
    {
      "word": "库存维护",
      "pinyin": "kùcún wéihù",
      "meaning": "bảo trì tồn kho",
      "example": "我们需要库存维护。",
      "examplePinyin": "Wǒmen xūyào kùcún wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tồn kho."
    },
    {
      "word": "库存设计",
      "pinyin": "kùcún shèjì",
      "meaning": "thiết kế tồn kho",
      "example": "我们需要库存设计。",
      "examplePinyin": "Wǒmen xūyào kùcún shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tồn kho."
    },
    {
      "word": "库存开发",
      "pinyin": "kùcún kāifā",
      "meaning": "phát triển tồn kho",
      "example": "我们需要库存开发。",
      "examplePinyin": "Wǒmen xūyào kùcún kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tồn kho."
    },
    {
      "word": "库存训练",
      "pinyin": "kùcún xùnliàn",
      "meaning": "huấn luyện tồn kho",
      "example": "我们需要库存训练。",
      "examplePinyin": "Wǒmen xūyào kùcún xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tồn kho."
    },
    {
      "word": "库存识别",
      "pinyin": "kùcún shíbié",
      "meaning": "nhận dạng tồn kho",
      "example": "我们需要库存识别。",
      "examplePinyin": "Wǒmen xūyào kùcún shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tồn kho."
    },
    {
      "word": "库存生成",
      "pinyin": "kùcún shēngchéng",
      "meaning": "tạo sinh tồn kho",
      "example": "我们需要库存生成。",
      "examplePinyin": "Wǒmen xūyào kùcún shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tồn kho."
    },
    {
      "word": "库存通知",
      "pinyin": "kùcún tōngzhī",
      "meaning": "thông báo tồn kho",
      "example": "我们需要库存通知。",
      "examplePinyin": "Wǒmen xūyào kùcún tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tồn kho."
    },
    {
      "word": "库存权限",
      "pinyin": "kùcún quánxiàn",
      "meaning": "quyền hạn tồn kho",
      "example": "我们需要库存权限。",
      "examplePinyin": "Wǒmen xūyào kùcún quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tồn kho."
    },
    {
      "word": "库存状态",
      "pinyin": "kùcún zhuàngtài",
      "meaning": "trạng thái tồn kho",
      "example": "我们需要库存状态。",
      "examplePinyin": "Wǒmen xūyào kùcún zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tồn kho."
    },
    {
      "word": "库存编号",
      "pinyin": "kùcún biānhào",
      "meaning": "mã số tồn kho",
      "example": "我们需要库存编号。",
      "examplePinyin": "Wǒmen xūyào kùcún biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tồn kho."
    },
    {
      "word": "库存模板",
      "pinyin": "kùcún múbǎn",
      "meaning": "mẫu/template tồn kho",
      "example": "我们需要库存模板。",
      "examplePinyin": "Wǒmen xūyào kùcún múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tồn kho."
    },
    {
      "word": "库存异常",
      "pinyin": "kùcún yìcháng",
      "meaning": "bất thường/lỗi tồn kho",
      "example": "我们需要库存异常。",
      "examplePinyin": "Wǒmen xūyào kùcún yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tồn kho."
    },
    {
      "word": "仓库管理",
      "pinyin": "cāngkù guǎnlǐ",
      "meaning": "quản lý kho hàng",
      "example": "我们需要仓库管理。",
      "examplePinyin": "Wǒmen xūyào cāngkù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý kho hàng."
    },
    {
      "word": "仓库处理",
      "pinyin": "cāngkù chǔlǐ",
      "meaning": "xử lý kho hàng",
      "example": "我们需要仓库处理。",
      "examplePinyin": "Wǒmen xūyào cāngkù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý kho hàng."
    },
    {
      "word": "仓库分析",
      "pinyin": "cāngkù fēnxī",
      "meaning": "phân tích kho hàng",
      "example": "我们需要仓库分析。",
      "examplePinyin": "Wǒmen xūyào cāngkù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích kho hàng."
    },
    {
      "word": "仓库检查",
      "pinyin": "cāngkù jiǎnchá",
      "meaning": "kiểm tra kho hàng",
      "example": "我们需要仓库检查。",
      "examplePinyin": "Wǒmen xūyào cāngkù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra kho hàng."
    },
    {
      "word": "仓库记录",
      "pinyin": "cāngkù jìlù",
      "meaning": "ghi chép kho hàng",
      "example": "我们需要仓库记录。",
      "examplePinyin": "Wǒmen xūyào cāngkù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép kho hàng."
    },
    {
      "word": "仓库设置",
      "pinyin": "cāngkù shèzhì",
      "meaning": "cài đặt kho hàng",
      "example": "我们需要仓库设置。",
      "examplePinyin": "Wǒmen xūyào cāngkù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt kho hàng."
    },
    {
      "word": "仓库更新",
      "pinyin": "cāngkù gēngxīn",
      "meaning": "cập nhật kho hàng",
      "example": "我们需要仓库更新。",
      "examplePinyin": "Wǒmen xūyào cāngkù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật kho hàng."
    },
    {
      "word": "仓库优化",
      "pinyin": "cāngkù yōuhuà",
      "meaning": "tối ưu hóa kho hàng",
      "example": "我们需要仓库优化。",
      "examplePinyin": "Wǒmen xūyào cāngkù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa kho hàng."
    },
    {
      "word": "仓库导入",
      "pinyin": "cāngkù dǎorù",
      "meaning": "nhập vào kho hàng",
      "example": "我们需要仓库导入。",
      "examplePinyin": "Wǒmen xūyào cāngkù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào kho hàng."
    },
    {
      "word": "仓库导出",
      "pinyin": "cāngkù dǎochū",
      "meaning": "xuất ra kho hàng",
      "example": "我们需要仓库导出。",
      "examplePinyin": "Wǒmen xūyào cāngkù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra kho hàng."
    },
    {
      "word": "仓库备份",
      "pinyin": "cāngkù bèifèn",
      "meaning": "sao lưu kho hàng",
      "example": "我们需要仓库备份。",
      "examplePinyin": "Wǒmen xūyào cāngkù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu kho hàng."
    },
    {
      "word": "仓库同步",
      "pinyin": "cāngkù tóngbù",
      "meaning": "đồng bộ kho hàng",
      "example": "我们需要仓库同步。",
      "examplePinyin": "Wǒmen xūyào cāngkù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ kho hàng."
    },
    {
      "word": "仓库搜索",
      "pinyin": "cāngkù sōusuǒ",
      "meaning": "tìm kiếm kho hàng",
      "example": "我们需要仓库搜索。",
      "examplePinyin": "Wǒmen xūyào cāngkù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm kho hàng."
    },
    {
      "word": "仓库分类",
      "pinyin": "cāngkù fēnlèi",
      "meaning": "phân loại kho hàng",
      "example": "我们需要仓库分类。",
      "examplePinyin": "Wǒmen xūyào cāngkù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại kho hàng."
    },
    {
      "word": "仓库统计",
      "pinyin": "cāngkù tǒngjì",
      "meaning": "thống kê kho hàng",
      "example": "我们需要仓库统计。",
      "examplePinyin": "Wǒmen xūyào cāngkù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê kho hàng."
    },
    {
      "word": "仓库确认",
      "pinyin": "cāngkù quèrèn",
      "meaning": "xác nhận kho hàng",
      "example": "我们需要仓库确认。",
      "examplePinyin": "Wǒmen xūyào cāngkù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận kho hàng."
    },
    {
      "word": "仓库审核",
      "pinyin": "cāngkù shěnhé",
      "meaning": "duyệt/kiểm duyệt kho hàng",
      "example": "我们需要仓库审核。",
      "examplePinyin": "Wǒmen xūyào cāngkù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt kho hàng."
    },
    {
      "word": "仓库测试",
      "pinyin": "cāngkù cèshì",
      "meaning": "kiểm thử kho hàng",
      "example": "我们需要仓库测试。",
      "examplePinyin": "Wǒmen xūyào cāngkù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử kho hàng."
    },
    {
      "word": "仓库维护",
      "pinyin": "cāngkù wéihù",
      "meaning": "bảo trì kho hàng",
      "example": "我们需要仓库维护。",
      "examplePinyin": "Wǒmen xūyào cāngkù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì kho hàng."
    },
    {
      "word": "仓库设计",
      "pinyin": "cāngkù shèjì",
      "meaning": "thiết kế kho hàng",
      "example": "我们需要仓库设计。",
      "examplePinyin": "Wǒmen xūyào cāngkù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế kho hàng."
    },
    {
      "word": "仓库开发",
      "pinyin": "cāngkù kāifā",
      "meaning": "phát triển kho hàng",
      "example": "我们需要仓库开发。",
      "examplePinyin": "Wǒmen xūyào cāngkù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển kho hàng."
    },
    {
      "word": "仓库训练",
      "pinyin": "cāngkù xùnliàn",
      "meaning": "huấn luyện kho hàng",
      "example": "我们需要仓库训练。",
      "examplePinyin": "Wǒmen xūyào cāngkù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện kho hàng."
    },
    {
      "word": "仓库识别",
      "pinyin": "cāngkù shíbié",
      "meaning": "nhận dạng kho hàng",
      "example": "我们需要仓库识别。",
      "examplePinyin": "Wǒmen xūyào cāngkù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng kho hàng."
    },
    {
      "word": "仓库生成",
      "pinyin": "cāngkù shēngchéng",
      "meaning": "tạo sinh kho hàng",
      "example": "我们需要仓库生成。",
      "examplePinyin": "Wǒmen xūyào cāngkù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh kho hàng."
    },
    {
      "word": "仓库通知",
      "pinyin": "cāngkù tōngzhī",
      "meaning": "thông báo kho hàng",
      "example": "我们需要仓库通知。",
      "examplePinyin": "Wǒmen xūyào cāngkù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo kho hàng."
    },
    {
      "word": "仓库权限",
      "pinyin": "cāngkù quánxiàn",
      "meaning": "quyền hạn kho hàng",
      "example": "我们需要仓库权限。",
      "examplePinyin": "Wǒmen xūyào cāngkù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn kho hàng."
    },
    {
      "word": "仓库状态",
      "pinyin": "cāngkù zhuàngtài",
      "meaning": "trạng thái kho hàng",
      "example": "我们需要仓库状态。",
      "examplePinyin": "Wǒmen xūyào cāngkù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái kho hàng."
    },
    {
      "word": "仓库编号",
      "pinyin": "cāngkù biānhào",
      "meaning": "mã số kho hàng",
      "example": "我们需要仓库编号。",
      "examplePinyin": "Wǒmen xūyào cāngkù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số kho hàng."
    },
    {
      "word": "仓库模板",
      "pinyin": "cāngkù múbǎn",
      "meaning": "mẫu/template kho hàng",
      "example": "我们需要仓库模板。",
      "examplePinyin": "Wǒmen xūyào cāngkù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template kho hàng."
    },
    {
      "word": "仓库异常",
      "pinyin": "cāngkù yìcháng",
      "meaning": "bất thường/lỗi kho hàng",
      "example": "我们需要仓库异常。",
      "examplePinyin": "Wǒmen xūyào cāngkù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi kho hàng."
    },
    {
      "word": "物流管理",
      "pinyin": "wùliú guǎnlǐ",
      "meaning": "quản lý logistics",
      "example": "我们需要物流管理。",
      "examplePinyin": "Wǒmen xūyào wùliú guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý logistics."
    },
    {
      "word": "物流处理",
      "pinyin": "wùliú chǔlǐ",
      "meaning": "xử lý logistics",
      "example": "我们需要物流处理。",
      "examplePinyin": "Wǒmen xūyào wùliú chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý logistics."
    },
    {
      "word": "物流分析",
      "pinyin": "wùliú fēnxī",
      "meaning": "phân tích logistics",
      "example": "我们需要物流分析。",
      "examplePinyin": "Wǒmen xūyào wùliú fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích logistics."
    },
    {
      "word": "物流检查",
      "pinyin": "wùliú jiǎnchá",
      "meaning": "kiểm tra logistics",
      "example": "我们需要物流检查。",
      "examplePinyin": "Wǒmen xūyào wùliú jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra logistics."
    },
    {
      "word": "物流记录",
      "pinyin": "wùliú jìlù",
      "meaning": "ghi chép logistics",
      "example": "我们需要物流记录。",
      "examplePinyin": "Wǒmen xūyào wùliú jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép logistics."
    },
    {
      "word": "物流设置",
      "pinyin": "wùliú shèzhì",
      "meaning": "cài đặt logistics",
      "example": "我们需要物流设置。",
      "examplePinyin": "Wǒmen xūyào wùliú shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt logistics."
    },
    {
      "word": "物流更新",
      "pinyin": "wùliú gēngxīn",
      "meaning": "cập nhật logistics",
      "example": "我们需要物流更新。",
      "examplePinyin": "Wǒmen xūyào wùliú gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật logistics."
    },
    {
      "word": "物流优化",
      "pinyin": "wùliú yōuhuà",
      "meaning": "tối ưu hóa logistics",
      "example": "我们需要物流优化。",
      "examplePinyin": "Wǒmen xūyào wùliú yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa logistics."
    },
    {
      "word": "物流导入",
      "pinyin": "wùliú dǎorù",
      "meaning": "nhập vào logistics",
      "example": "我们需要物流导入。",
      "examplePinyin": "Wǒmen xūyào wùliú dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào logistics."
    },
    {
      "word": "物流导出",
      "pinyin": "wùliú dǎochū",
      "meaning": "xuất ra logistics",
      "example": "我们需要物流导出。",
      "examplePinyin": "Wǒmen xūyào wùliú dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra logistics."
    },
    {
      "word": "物流备份",
      "pinyin": "wùliú bèifèn",
      "meaning": "sao lưu logistics",
      "example": "我们需要物流备份。",
      "examplePinyin": "Wǒmen xūyào wùliú bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu logistics."
    },
    {
      "word": "物流同步",
      "pinyin": "wùliú tóngbù",
      "meaning": "đồng bộ logistics",
      "example": "我们需要物流同步。",
      "examplePinyin": "Wǒmen xūyào wùliú tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ logistics."
    },
    {
      "word": "物流搜索",
      "pinyin": "wùliú sōusuǒ",
      "meaning": "tìm kiếm logistics",
      "example": "我们需要物流搜索。",
      "examplePinyin": "Wǒmen xūyào wùliú sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm logistics."
    },
    {
      "word": "物流分类",
      "pinyin": "wùliú fēnlèi",
      "meaning": "phân loại logistics",
      "example": "我们需要物流分类。",
      "examplePinyin": "Wǒmen xūyào wùliú fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại logistics."
    },
    {
      "word": "物流统计",
      "pinyin": "wùliú tǒngjì",
      "meaning": "thống kê logistics",
      "example": "我们需要物流统计。",
      "examplePinyin": "Wǒmen xūyào wùliú tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê logistics."
    },
    {
      "word": "物流确认",
      "pinyin": "wùliú quèrèn",
      "meaning": "xác nhận logistics",
      "example": "我们需要物流确认。",
      "examplePinyin": "Wǒmen xūyào wùliú quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận logistics."
    },
    {
      "word": "物流审核",
      "pinyin": "wùliú shěnhé",
      "meaning": "duyệt/kiểm duyệt logistics",
      "example": "我们需要物流审核。",
      "examplePinyin": "Wǒmen xūyào wùliú shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt logistics."
    },
    {
      "word": "物流测试",
      "pinyin": "wùliú cèshì",
      "meaning": "kiểm thử logistics",
      "example": "我们需要物流测试。",
      "examplePinyin": "Wǒmen xūyào wùliú cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử logistics."
    },
    {
      "word": "物流维护",
      "pinyin": "wùliú wéihù",
      "meaning": "bảo trì logistics",
      "example": "我们需要物流维护。",
      "examplePinyin": "Wǒmen xūyào wùliú wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì logistics."
    },
    {
      "word": "物流设计",
      "pinyin": "wùliú shèjì",
      "meaning": "thiết kế logistics",
      "example": "我们需要物流设计。",
      "examplePinyin": "Wǒmen xūyào wùliú shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế logistics."
    },
    {
      "word": "物流开发",
      "pinyin": "wùliú kāifā",
      "meaning": "phát triển logistics",
      "example": "我们需要物流开发。",
      "examplePinyin": "Wǒmen xūyào wùliú kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển logistics."
    },
    {
      "word": "物流训练",
      "pinyin": "wùliú xùnliàn",
      "meaning": "huấn luyện logistics",
      "example": "我们需要物流训练。",
      "examplePinyin": "Wǒmen xūyào wùliú xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện logistics."
    },
    {
      "word": "物流识别",
      "pinyin": "wùliú shíbié",
      "meaning": "nhận dạng logistics",
      "example": "我们需要物流识别。",
      "examplePinyin": "Wǒmen xūyào wùliú shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng logistics."
    },
    {
      "word": "物流生成",
      "pinyin": "wùliú shēngchéng",
      "meaning": "tạo sinh logistics",
      "example": "我们需要物流生成。",
      "examplePinyin": "Wǒmen xūyào wùliú shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh logistics."
    },
    {
      "word": "物流通知",
      "pinyin": "wùliú tōngzhī",
      "meaning": "thông báo logistics",
      "example": "我们需要物流通知。",
      "examplePinyin": "Wǒmen xūyào wùliú tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo logistics."
    },
    {
      "word": "物流权限",
      "pinyin": "wùliú quánxiàn",
      "meaning": "quyền hạn logistics",
      "example": "我们需要物流权限。",
      "examplePinyin": "Wǒmen xūyào wùliú quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn logistics."
    },
    {
      "word": "物流状态",
      "pinyin": "wùliú zhuàngtài",
      "meaning": "trạng thái logistics",
      "example": "我们需要物流状态。",
      "examplePinyin": "Wǒmen xūyào wùliú zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái logistics."
    },
    {
      "word": "物流编号",
      "pinyin": "wùliú biānhào",
      "meaning": "mã số logistics",
      "example": "我们需要物流编号。",
      "examplePinyin": "Wǒmen xūyào wùliú biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số logistics."
    },
    {
      "word": "物流模板",
      "pinyin": "wùliú múbǎn",
      "meaning": "mẫu/template logistics",
      "example": "我们需要物流模板。",
      "examplePinyin": "Wǒmen xūyào wùliú múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template logistics."
    },
    {
      "word": "物流异常",
      "pinyin": "wùliú yìcháng",
      "meaning": "bất thường/lỗi logistics",
      "example": "我们需要物流异常。",
      "examplePinyin": "Wǒmen xūyào wùliú yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi logistics."
    },
    {
      "word": "快递管理",
      "pinyin": "kuàidì guǎnlǐ",
      "meaning": "quản lý chuyển phát nhanh",
      "example": "我们需要快递管理。",
      "examplePinyin": "Wǒmen xūyào kuàidì guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý chuyển phát nhanh."
    },
    {
      "word": "快递处理",
      "pinyin": "kuàidì chǔlǐ",
      "meaning": "xử lý chuyển phát nhanh",
      "example": "我们需要快递处理。",
      "examplePinyin": "Wǒmen xūyào kuàidì chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý chuyển phát nhanh."
    },
    {
      "word": "快递分析",
      "pinyin": "kuàidì fēnxī",
      "meaning": "phân tích chuyển phát nhanh",
      "example": "我们需要快递分析。",
      "examplePinyin": "Wǒmen xūyào kuàidì fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích chuyển phát nhanh."
    },
    {
      "word": "快递检查",
      "pinyin": "kuàidì jiǎnchá",
      "meaning": "kiểm tra chuyển phát nhanh",
      "example": "我们需要快递检查。",
      "examplePinyin": "Wǒmen xūyào kuàidì jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra chuyển phát nhanh."
    },
    {
      "word": "快递记录",
      "pinyin": "kuàidì jìlù",
      "meaning": "ghi chép chuyển phát nhanh",
      "example": "我们需要快递记录。",
      "examplePinyin": "Wǒmen xūyào kuàidì jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép chuyển phát nhanh."
    },
    {
      "word": "快递设置",
      "pinyin": "kuàidì shèzhì",
      "meaning": "cài đặt chuyển phát nhanh",
      "example": "我们需要快递设置。",
      "examplePinyin": "Wǒmen xūyào kuàidì shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt chuyển phát nhanh."
    },
    {
      "word": "快递更新",
      "pinyin": "kuàidì gēngxīn",
      "meaning": "cập nhật chuyển phát nhanh",
      "example": "我们需要快递更新。",
      "examplePinyin": "Wǒmen xūyào kuàidì gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật chuyển phát nhanh."
    },
    {
      "word": "快递优化",
      "pinyin": "kuàidì yōuhuà",
      "meaning": "tối ưu hóa chuyển phát nhanh",
      "example": "我们需要快递优化。",
      "examplePinyin": "Wǒmen xūyào kuàidì yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa chuyển phát nhanh."
    },
    {
      "word": "快递导入",
      "pinyin": "kuàidì dǎorù",
      "meaning": "nhập vào chuyển phát nhanh",
      "example": "我们需要快递导入。",
      "examplePinyin": "Wǒmen xūyào kuàidì dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào chuyển phát nhanh."
    },
    {
      "word": "快递导出",
      "pinyin": "kuàidì dǎochū",
      "meaning": "xuất ra chuyển phát nhanh",
      "example": "我们需要快递导出。",
      "examplePinyin": "Wǒmen xūyào kuàidì dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra chuyển phát nhanh."
    },
    {
      "word": "快递备份",
      "pinyin": "kuàidì bèifèn",
      "meaning": "sao lưu chuyển phát nhanh",
      "example": "我们需要快递备份。",
      "examplePinyin": "Wǒmen xūyào kuàidì bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu chuyển phát nhanh."
    },
    {
      "word": "快递同步",
      "pinyin": "kuàidì tóngbù",
      "meaning": "đồng bộ chuyển phát nhanh",
      "example": "我们需要快递同步。",
      "examplePinyin": "Wǒmen xūyào kuàidì tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ chuyển phát nhanh."
    },
    {
      "word": "快递搜索",
      "pinyin": "kuàidì sōusuǒ",
      "meaning": "tìm kiếm chuyển phát nhanh",
      "example": "我们需要快递搜索。",
      "examplePinyin": "Wǒmen xūyào kuàidì sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm chuyển phát nhanh."
    },
    {
      "word": "快递分类",
      "pinyin": "kuàidì fēnlèi",
      "meaning": "phân loại chuyển phát nhanh",
      "example": "我们需要快递分类。",
      "examplePinyin": "Wǒmen xūyào kuàidì fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại chuyển phát nhanh."
    },
    {
      "word": "快递统计",
      "pinyin": "kuàidì tǒngjì",
      "meaning": "thống kê chuyển phát nhanh",
      "example": "我们需要快递统计。",
      "examplePinyin": "Wǒmen xūyào kuàidì tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê chuyển phát nhanh."
    },
    {
      "word": "快递确认",
      "pinyin": "kuàidì quèrèn",
      "meaning": "xác nhận chuyển phát nhanh",
      "example": "我们需要快递确认。",
      "examplePinyin": "Wǒmen xūyào kuàidì quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận chuyển phát nhanh."
    },
    {
      "word": "快递审核",
      "pinyin": "kuàidì shěnhé",
      "meaning": "duyệt/kiểm duyệt chuyển phát nhanh",
      "example": "我们需要快递审核。",
      "examplePinyin": "Wǒmen xūyào kuàidì shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt chuyển phát nhanh."
    },
    {
      "word": "快递测试",
      "pinyin": "kuàidì cèshì",
      "meaning": "kiểm thử chuyển phát nhanh",
      "example": "我们需要快递测试。",
      "examplePinyin": "Wǒmen xūyào kuàidì cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử chuyển phát nhanh."
    },
    {
      "word": "快递维护",
      "pinyin": "kuàidì wéihù",
      "meaning": "bảo trì chuyển phát nhanh",
      "example": "我们需要快递维护。",
      "examplePinyin": "Wǒmen xūyào kuàidì wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì chuyển phát nhanh."
    },
    {
      "word": "快递设计",
      "pinyin": "kuàidì shèjì",
      "meaning": "thiết kế chuyển phát nhanh",
      "example": "我们需要快递设计。",
      "examplePinyin": "Wǒmen xūyào kuàidì shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế chuyển phát nhanh."
    },
    {
      "word": "快递开发",
      "pinyin": "kuàidì kāifā",
      "meaning": "phát triển chuyển phát nhanh",
      "example": "我们需要快递开发。",
      "examplePinyin": "Wǒmen xūyào kuàidì kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển chuyển phát nhanh."
    },
    {
      "word": "快递训练",
      "pinyin": "kuàidì xùnliàn",
      "meaning": "huấn luyện chuyển phát nhanh",
      "example": "我们需要快递训练。",
      "examplePinyin": "Wǒmen xūyào kuàidì xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện chuyển phát nhanh."
    },
    {
      "word": "快递识别",
      "pinyin": "kuàidì shíbié",
      "meaning": "nhận dạng chuyển phát nhanh",
      "example": "我们需要快递识别。",
      "examplePinyin": "Wǒmen xūyào kuàidì shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng chuyển phát nhanh."
    },
    {
      "word": "快递生成",
      "pinyin": "kuàidì shēngchéng",
      "meaning": "tạo sinh chuyển phát nhanh",
      "example": "我们需要快递生成。",
      "examplePinyin": "Wǒmen xūyào kuàidì shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh chuyển phát nhanh."
    },
    {
      "word": "快递通知",
      "pinyin": "kuàidì tōngzhī",
      "meaning": "thông báo chuyển phát nhanh",
      "example": "我们需要快递通知。",
      "examplePinyin": "Wǒmen xūyào kuàidì tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo chuyển phát nhanh."
    },
    {
      "word": "快递权限",
      "pinyin": "kuàidì quánxiàn",
      "meaning": "quyền hạn chuyển phát nhanh",
      "example": "我们需要快递权限。",
      "examplePinyin": "Wǒmen xūyào kuàidì quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn chuyển phát nhanh."
    },
    {
      "word": "快递状态",
      "pinyin": "kuàidì zhuàngtài",
      "meaning": "trạng thái chuyển phát nhanh",
      "example": "我们需要快递状态。",
      "examplePinyin": "Wǒmen xūyào kuàidì zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái chuyển phát nhanh."
    },
    {
      "word": "快递编号",
      "pinyin": "kuàidì biānhào",
      "meaning": "mã số chuyển phát nhanh",
      "example": "我们需要快递编号。",
      "examplePinyin": "Wǒmen xūyào kuàidì biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số chuyển phát nhanh."
    },
    {
      "word": "快递模板",
      "pinyin": "kuàidì múbǎn",
      "meaning": "mẫu/template chuyển phát nhanh",
      "example": "我们需要快递模板。",
      "examplePinyin": "Wǒmen xūyào kuàidì múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template chuyển phát nhanh."
    },
    {
      "word": "快递异常",
      "pinyin": "kuàidì yìcháng",
      "meaning": "bất thường/lỗi chuyển phát nhanh",
      "example": "我们需要快递异常。",
      "examplePinyin": "Wǒmen xūyào kuàidì yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi chuyển phát nhanh."
    },
    {
      "word": "包裹管理",
      "pinyin": "bāoguǒ guǎnlǐ",
      "meaning": "quản lý kiện hàng",
      "example": "我们需要包裹管理。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý kiện hàng."
    },
    {
      "word": "包裹处理",
      "pinyin": "bāoguǒ chǔlǐ",
      "meaning": "xử lý kiện hàng",
      "example": "我们需要包裹处理。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý kiện hàng."
    },
    {
      "word": "包裹分析",
      "pinyin": "bāoguǒ fēnxī",
      "meaning": "phân tích kiện hàng",
      "example": "我们需要包裹分析。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích kiện hàng."
    },
    {
      "word": "包裹检查",
      "pinyin": "bāoguǒ jiǎnchá",
      "meaning": "kiểm tra kiện hàng",
      "example": "我们需要包裹检查。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra kiện hàng."
    },
    {
      "word": "包裹记录",
      "pinyin": "bāoguǒ jìlù",
      "meaning": "ghi chép kiện hàng",
      "example": "我们需要包裹记录。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép kiện hàng."
    },
    {
      "word": "包裹设置",
      "pinyin": "bāoguǒ shèzhì",
      "meaning": "cài đặt kiện hàng",
      "example": "我们需要包裹设置。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt kiện hàng."
    },
    {
      "word": "包裹更新",
      "pinyin": "bāoguǒ gēngxīn",
      "meaning": "cập nhật kiện hàng",
      "example": "我们需要包裹更新。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật kiện hàng."
    },
    {
      "word": "包裹优化",
      "pinyin": "bāoguǒ yōuhuà",
      "meaning": "tối ưu hóa kiện hàng",
      "example": "我们需要包裹优化。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa kiện hàng."
    },
    {
      "word": "包裹导入",
      "pinyin": "bāoguǒ dǎorù",
      "meaning": "nhập vào kiện hàng",
      "example": "我们需要包裹导入。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào kiện hàng."
    },
    {
      "word": "包裹导出",
      "pinyin": "bāoguǒ dǎochū",
      "meaning": "xuất ra kiện hàng",
      "example": "我们需要包裹导出。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra kiện hàng."
    },
    {
      "word": "包裹备份",
      "pinyin": "bāoguǒ bèifèn",
      "meaning": "sao lưu kiện hàng",
      "example": "我们需要包裹备份。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu kiện hàng."
    },
    {
      "word": "包裹同步",
      "pinyin": "bāoguǒ tóngbù",
      "meaning": "đồng bộ kiện hàng",
      "example": "我们需要包裹同步。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ kiện hàng."
    },
    {
      "word": "包裹搜索",
      "pinyin": "bāoguǒ sōusuǒ",
      "meaning": "tìm kiếm kiện hàng",
      "example": "我们需要包裹搜索。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm kiện hàng."
    },
    {
      "word": "包裹分类",
      "pinyin": "bāoguǒ fēnlèi",
      "meaning": "phân loại kiện hàng",
      "example": "我们需要包裹分类。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại kiện hàng."
    },
    {
      "word": "包裹统计",
      "pinyin": "bāoguǒ tǒngjì",
      "meaning": "thống kê kiện hàng",
      "example": "我们需要包裹统计。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê kiện hàng."
    },
    {
      "word": "包裹确认",
      "pinyin": "bāoguǒ quèrèn",
      "meaning": "xác nhận kiện hàng",
      "example": "我们需要包裹确认。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận kiện hàng."
    },
    {
      "word": "包裹审核",
      "pinyin": "bāoguǒ shěnhé",
      "meaning": "duyệt/kiểm duyệt kiện hàng",
      "example": "我们需要包裹审核。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt kiện hàng."
    },
    {
      "word": "包裹测试",
      "pinyin": "bāoguǒ cèshì",
      "meaning": "kiểm thử kiện hàng",
      "example": "我们需要包裹测试。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử kiện hàng."
    },
    {
      "word": "包裹维护",
      "pinyin": "bāoguǒ wéihù",
      "meaning": "bảo trì kiện hàng",
      "example": "我们需要包裹维护。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì kiện hàng."
    },
    {
      "word": "包裹设计",
      "pinyin": "bāoguǒ shèjì",
      "meaning": "thiết kế kiện hàng",
      "example": "我们需要包裹设计。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế kiện hàng."
    },
    {
      "word": "包裹开发",
      "pinyin": "bāoguǒ kāifā",
      "meaning": "phát triển kiện hàng",
      "example": "我们需要包裹开发。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển kiện hàng."
    },
    {
      "word": "包裹训练",
      "pinyin": "bāoguǒ xùnliàn",
      "meaning": "huấn luyện kiện hàng",
      "example": "我们需要包裹训练。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện kiện hàng."
    },
    {
      "word": "包裹识别",
      "pinyin": "bāoguǒ shíbié",
      "meaning": "nhận dạng kiện hàng",
      "example": "我们需要包裹识别。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng kiện hàng."
    },
    {
      "word": "包裹生成",
      "pinyin": "bāoguǒ shēngchéng",
      "meaning": "tạo sinh kiện hàng",
      "example": "我们需要包裹生成。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh kiện hàng."
    },
    {
      "word": "包裹通知",
      "pinyin": "bāoguǒ tōngzhī",
      "meaning": "thông báo kiện hàng",
      "example": "我们需要包裹通知。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo kiện hàng."
    },
    {
      "word": "包裹权限",
      "pinyin": "bāoguǒ quánxiàn",
      "meaning": "quyền hạn kiện hàng",
      "example": "我们需要包裹权限。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn kiện hàng."
    },
    {
      "word": "包裹状态",
      "pinyin": "bāoguǒ zhuàngtài",
      "meaning": "trạng thái kiện hàng",
      "example": "我们需要包裹状态。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái kiện hàng."
    },
    {
      "word": "包裹编号",
      "pinyin": "bāoguǒ biānhào",
      "meaning": "mã số kiện hàng",
      "example": "我们需要包裹编号。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số kiện hàng."
    },
    {
      "word": "包裹模板",
      "pinyin": "bāoguǒ múbǎn",
      "meaning": "mẫu/template kiện hàng",
      "example": "我们需要包裹模板。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template kiện hàng."
    },
    {
      "word": "包裹异常",
      "pinyin": "bāoguǒ yìcháng",
      "meaning": "bất thường/lỗi kiện hàng",
      "example": "我们需要包裹异常。",
      "examplePinyin": "Wǒmen xūyào bāoguǒ yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi kiện hàng."
    },
    {
      "word": "运费管理",
      "pinyin": "yùnfèi guǎnlǐ",
      "meaning": "quản lý phí vận chuyển",
      "example": "我们需要运费管理。",
      "examplePinyin": "Wǒmen xūyào yùnfèi guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý phí vận chuyển."
    },
    {
      "word": "运费处理",
      "pinyin": "yùnfèi chǔlǐ",
      "meaning": "xử lý phí vận chuyển",
      "example": "我们需要运费处理。",
      "examplePinyin": "Wǒmen xūyào yùnfèi chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý phí vận chuyển."
    },
    {
      "word": "运费分析",
      "pinyin": "yùnfèi fēnxī",
      "meaning": "phân tích phí vận chuyển",
      "example": "我们需要运费分析。",
      "examplePinyin": "Wǒmen xūyào yùnfèi fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích phí vận chuyển."
    },
    {
      "word": "运费检查",
      "pinyin": "yùnfèi jiǎnchá",
      "meaning": "kiểm tra phí vận chuyển",
      "example": "我们需要运费检查。",
      "examplePinyin": "Wǒmen xūyào yùnfèi jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra phí vận chuyển."
    },
    {
      "word": "运费记录",
      "pinyin": "yùnfèi jìlù",
      "meaning": "ghi chép phí vận chuyển",
      "example": "我们需要运费记录。",
      "examplePinyin": "Wǒmen xūyào yùnfèi jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép phí vận chuyển."
    },
    {
      "word": "运费设置",
      "pinyin": "yùnfèi shèzhì",
      "meaning": "cài đặt phí vận chuyển",
      "example": "我们需要运费设置。",
      "examplePinyin": "Wǒmen xūyào yùnfèi shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt phí vận chuyển."
    },
    {
      "word": "运费更新",
      "pinyin": "yùnfèi gēngxīn",
      "meaning": "cập nhật phí vận chuyển",
      "example": "我们需要运费更新。",
      "examplePinyin": "Wǒmen xūyào yùnfèi gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật phí vận chuyển."
    },
    {
      "word": "运费优化",
      "pinyin": "yùnfèi yōuhuà",
      "meaning": "tối ưu hóa phí vận chuyển",
      "example": "我们需要运费优化。",
      "examplePinyin": "Wǒmen xūyào yùnfèi yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa phí vận chuyển."
    },
    {
      "word": "运费导入",
      "pinyin": "yùnfèi dǎorù",
      "meaning": "nhập vào phí vận chuyển",
      "example": "我们需要运费导入。",
      "examplePinyin": "Wǒmen xūyào yùnfèi dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào phí vận chuyển."
    },
    {
      "word": "运费导出",
      "pinyin": "yùnfèi dǎochū",
      "meaning": "xuất ra phí vận chuyển",
      "example": "我们需要运费导出。",
      "examplePinyin": "Wǒmen xūyào yùnfèi dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra phí vận chuyển."
    },
    {
      "word": "运费备份",
      "pinyin": "yùnfèi bèifèn",
      "meaning": "sao lưu phí vận chuyển",
      "example": "我们需要运费备份。",
      "examplePinyin": "Wǒmen xūyào yùnfèi bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu phí vận chuyển."
    },
    {
      "word": "运费同步",
      "pinyin": "yùnfèi tóngbù",
      "meaning": "đồng bộ phí vận chuyển",
      "example": "我们需要运费同步。",
      "examplePinyin": "Wǒmen xūyào yùnfèi tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ phí vận chuyển."
    },
    {
      "word": "运费搜索",
      "pinyin": "yùnfèi sōusuǒ",
      "meaning": "tìm kiếm phí vận chuyển",
      "example": "我们需要运费搜索。",
      "examplePinyin": "Wǒmen xūyào yùnfèi sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm phí vận chuyển."
    },
    {
      "word": "运费分类",
      "pinyin": "yùnfèi fēnlèi",
      "meaning": "phân loại phí vận chuyển",
      "example": "我们需要运费分类。",
      "examplePinyin": "Wǒmen xūyào yùnfèi fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại phí vận chuyển."
    },
    {
      "word": "运费统计",
      "pinyin": "yùnfèi tǒngjì",
      "meaning": "thống kê phí vận chuyển",
      "example": "我们需要运费统计。",
      "examplePinyin": "Wǒmen xūyào yùnfèi tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê phí vận chuyển."
    },
    {
      "word": "运费确认",
      "pinyin": "yùnfèi quèrèn",
      "meaning": "xác nhận phí vận chuyển",
      "example": "我们需要运费确认。",
      "examplePinyin": "Wǒmen xūyào yùnfèi quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận phí vận chuyển."
    },
    {
      "word": "运费审核",
      "pinyin": "yùnfèi shěnhé",
      "meaning": "duyệt/kiểm duyệt phí vận chuyển",
      "example": "我们需要运费审核。",
      "examplePinyin": "Wǒmen xūyào yùnfèi shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt phí vận chuyển."
    },
    {
      "word": "运费测试",
      "pinyin": "yùnfèi cèshì",
      "meaning": "kiểm thử phí vận chuyển",
      "example": "我们需要运费测试。",
      "examplePinyin": "Wǒmen xūyào yùnfèi cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử phí vận chuyển."
    },
    {
      "word": "运费维护",
      "pinyin": "yùnfèi wéihù",
      "meaning": "bảo trì phí vận chuyển",
      "example": "我们需要运费维护。",
      "examplePinyin": "Wǒmen xūyào yùnfèi wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì phí vận chuyển."
    },
    {
      "word": "运费设计",
      "pinyin": "yùnfèi shèjì",
      "meaning": "thiết kế phí vận chuyển",
      "example": "我们需要运费设计。",
      "examplePinyin": "Wǒmen xūyào yùnfèi shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế phí vận chuyển."
    },
    {
      "word": "运费开发",
      "pinyin": "yùnfèi kāifā",
      "meaning": "phát triển phí vận chuyển",
      "example": "我们需要运费开发。",
      "examplePinyin": "Wǒmen xūyào yùnfèi kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển phí vận chuyển."
    },
    {
      "word": "运费训练",
      "pinyin": "yùnfèi xùnliàn",
      "meaning": "huấn luyện phí vận chuyển",
      "example": "我们需要运费训练。",
      "examplePinyin": "Wǒmen xūyào yùnfèi xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện phí vận chuyển."
    },
    {
      "word": "运费识别",
      "pinyin": "yùnfèi shíbié",
      "meaning": "nhận dạng phí vận chuyển",
      "example": "我们需要运费识别。",
      "examplePinyin": "Wǒmen xūyào yùnfèi shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng phí vận chuyển."
    },
    {
      "word": "运费生成",
      "pinyin": "yùnfèi shēngchéng",
      "meaning": "tạo sinh phí vận chuyển",
      "example": "我们需要运费生成。",
      "examplePinyin": "Wǒmen xūyào yùnfèi shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh phí vận chuyển."
    },
    {
      "word": "运费通知",
      "pinyin": "yùnfèi tōngzhī",
      "meaning": "thông báo phí vận chuyển",
      "example": "我们需要运费通知。",
      "examplePinyin": "Wǒmen xūyào yùnfèi tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo phí vận chuyển."
    },
    {
      "word": "运费权限",
      "pinyin": "yùnfèi quánxiàn",
      "meaning": "quyền hạn phí vận chuyển",
      "example": "我们需要运费权限。",
      "examplePinyin": "Wǒmen xūyào yùnfèi quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn phí vận chuyển."
    },
    {
      "word": "运费状态",
      "pinyin": "yùnfèi zhuàngtài",
      "meaning": "trạng thái phí vận chuyển",
      "example": "我们需要运费状态。",
      "examplePinyin": "Wǒmen xūyào yùnfèi zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái phí vận chuyển."
    },
    {
      "word": "运费编号",
      "pinyin": "yùnfèi biānhào",
      "meaning": "mã số phí vận chuyển",
      "example": "我们需要运费编号。",
      "examplePinyin": "Wǒmen xūyào yùnfèi biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số phí vận chuyển."
    },
    {
      "word": "运费模板",
      "pinyin": "yùnfèi múbǎn",
      "meaning": "mẫu/template phí vận chuyển",
      "example": "我们需要运费模板。",
      "examplePinyin": "Wǒmen xūyào yùnfèi múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template phí vận chuyển."
    },
    {
      "word": "运费异常",
      "pinyin": "yùnfèi yìcháng",
      "meaning": "bất thường/lỗi phí vận chuyển",
      "example": "我们需要运费异常。",
      "examplePinyin": "Wǒmen xūyào yùnfèi yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi phí vận chuyển."
    },
    {
      "word": "货物管理",
      "pinyin": "huòwù guǎnlǐ",
      "meaning": "quản lý hàng hóa",
      "example": "我们需要货物管理。",
      "examplePinyin": "Wǒmen xūyào huòwù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hàng hóa."
    },
    {
      "word": "货物处理",
      "pinyin": "huòwù chǔlǐ",
      "meaning": "xử lý hàng hóa",
      "example": "我们需要货物处理。",
      "examplePinyin": "Wǒmen xūyào huòwù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hàng hóa."
    },
    {
      "word": "货物分析",
      "pinyin": "huòwù fēnxī",
      "meaning": "phân tích hàng hóa",
      "example": "我们需要货物分析。",
      "examplePinyin": "Wǒmen xūyào huòwù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hàng hóa."
    },
    {
      "word": "货物检查",
      "pinyin": "huòwù jiǎnchá",
      "meaning": "kiểm tra hàng hóa",
      "example": "我们需要货物检查。",
      "examplePinyin": "Wǒmen xūyào huòwù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hàng hóa."
    },
    {
      "word": "货物记录",
      "pinyin": "huòwù jìlù",
      "meaning": "ghi chép hàng hóa",
      "example": "我们需要货物记录。",
      "examplePinyin": "Wǒmen xūyào huòwù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hàng hóa."
    },
    {
      "word": "货物设置",
      "pinyin": "huòwù shèzhì",
      "meaning": "cài đặt hàng hóa",
      "example": "我们需要货物设置。",
      "examplePinyin": "Wǒmen xūyào huòwù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hàng hóa."
    },
    {
      "word": "货物更新",
      "pinyin": "huòwù gēngxīn",
      "meaning": "cập nhật hàng hóa",
      "example": "我们需要货物更新。",
      "examplePinyin": "Wǒmen xūyào huòwù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hàng hóa."
    },
    {
      "word": "货物优化",
      "pinyin": "huòwù yōuhuà",
      "meaning": "tối ưu hóa hàng hóa",
      "example": "我们需要货物优化。",
      "examplePinyin": "Wǒmen xūyào huòwù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hàng hóa."
    },
    {
      "word": "货物导入",
      "pinyin": "huòwù dǎorù",
      "meaning": "nhập vào hàng hóa",
      "example": "我们需要货物导入。",
      "examplePinyin": "Wǒmen xūyào huòwù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hàng hóa."
    },
    {
      "word": "货物导出",
      "pinyin": "huòwù dǎochū",
      "meaning": "xuất ra hàng hóa",
      "example": "我们需要货物导出。",
      "examplePinyin": "Wǒmen xūyào huòwù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hàng hóa."
    },
    {
      "word": "货物备份",
      "pinyin": "huòwù bèifèn",
      "meaning": "sao lưu hàng hóa",
      "example": "我们需要货物备份。",
      "examplePinyin": "Wǒmen xūyào huòwù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu hàng hóa."
    },
    {
      "word": "货物同步",
      "pinyin": "huòwù tóngbù",
      "meaning": "đồng bộ hàng hóa",
      "example": "我们需要货物同步。",
      "examplePinyin": "Wǒmen xūyào huòwù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ hàng hóa."
    },
    {
      "word": "货物搜索",
      "pinyin": "huòwù sōusuǒ",
      "meaning": "tìm kiếm hàng hóa",
      "example": "我们需要货物搜索。",
      "examplePinyin": "Wǒmen xūyào huòwù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm hàng hóa."
    },
    {
      "word": "货物分类",
      "pinyin": "huòwù fēnlèi",
      "meaning": "phân loại hàng hóa",
      "example": "我们需要货物分类。",
      "examplePinyin": "Wǒmen xūyào huòwù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại hàng hóa."
    },
    {
      "word": "货物统计",
      "pinyin": "huòwù tǒngjì",
      "meaning": "thống kê hàng hóa",
      "example": "我们需要货物统计。",
      "examplePinyin": "Wǒmen xūyào huòwù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê hàng hóa."
    },
    {
      "word": "货物确认",
      "pinyin": "huòwù quèrèn",
      "meaning": "xác nhận hàng hóa",
      "example": "我们需要货物确认。",
      "examplePinyin": "Wǒmen xūyào huòwù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận hàng hóa."
    },
    {
      "word": "货物审核",
      "pinyin": "huòwù shěnhé",
      "meaning": "duyệt/kiểm duyệt hàng hóa",
      "example": "我们需要货物审核。",
      "examplePinyin": "Wǒmen xūyào huòwù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt hàng hóa."
    },
    {
      "word": "货物测试",
      "pinyin": "huòwù cèshì",
      "meaning": "kiểm thử hàng hóa",
      "example": "我们需要货物测试。",
      "examplePinyin": "Wǒmen xūyào huòwù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử hàng hóa."
    },
    {
      "word": "货物维护",
      "pinyin": "huòwù wéihù",
      "meaning": "bảo trì hàng hóa",
      "example": "我们需要货物维护。",
      "examplePinyin": "Wǒmen xūyào huòwù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì hàng hóa."
    },
    {
      "word": "货物设计",
      "pinyin": "huòwù shèjì",
      "meaning": "thiết kế hàng hóa",
      "example": "我们需要货物设计。",
      "examplePinyin": "Wǒmen xūyào huòwù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế hàng hóa."
    },
    {
      "word": "货物开发",
      "pinyin": "huòwù kāifā",
      "meaning": "phát triển hàng hóa",
      "example": "我们需要货物开发。",
      "examplePinyin": "Wǒmen xūyào huòwù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển hàng hóa."
    },
    {
      "word": "货物训练",
      "pinyin": "huòwù xùnliàn",
      "meaning": "huấn luyện hàng hóa",
      "example": "我们需要货物训练。",
      "examplePinyin": "Wǒmen xūyào huòwù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện hàng hóa."
    },
    {
      "word": "货物识别",
      "pinyin": "huòwù shíbié",
      "meaning": "nhận dạng hàng hóa",
      "example": "我们需要货物识别。",
      "examplePinyin": "Wǒmen xūyào huòwù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng hàng hóa."
    },
    {
      "word": "货物生成",
      "pinyin": "huòwù shēngchéng",
      "meaning": "tạo sinh hàng hóa",
      "example": "我们需要货物生成。",
      "examplePinyin": "Wǒmen xūyào huòwù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh hàng hóa."
    },
    {
      "word": "货物通知",
      "pinyin": "huòwù tōngzhī",
      "meaning": "thông báo hàng hóa",
      "example": "我们需要货物通知。",
      "examplePinyin": "Wǒmen xūyào huòwù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo hàng hóa."
    },
    {
      "word": "货物权限",
      "pinyin": "huòwù quánxiàn",
      "meaning": "quyền hạn hàng hóa",
      "example": "我们需要货物权限。",
      "examplePinyin": "Wǒmen xūyào huòwù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn hàng hóa."
    },
    {
      "word": "货物状态",
      "pinyin": "huòwù zhuàngtài",
      "meaning": "trạng thái hàng hóa",
      "example": "我们需要货物状态。",
      "examplePinyin": "Wǒmen xūyào huòwù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái hàng hóa."
    },
    {
      "word": "货物编号",
      "pinyin": "huòwù biānhào",
      "meaning": "mã số hàng hóa",
      "example": "我们需要货物编号。",
      "examplePinyin": "Wǒmen xūyào huòwù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số hàng hóa."
    },
    {
      "word": "货物模板",
      "pinyin": "huòwù múbǎn",
      "meaning": "mẫu/template hàng hóa",
      "example": "我们需要货物模板。",
      "examplePinyin": "Wǒmen xūyào huòwù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template hàng hóa."
    },
    {
      "word": "货物异常",
      "pinyin": "huòwù yìcháng",
      "meaning": "bất thường/lỗi hàng hóa",
      "example": "我们需要货物异常。",
      "examplePinyin": "Wǒmen xūyào huòwù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi hàng hóa."
    },
    {
      "word": "货架管理",
      "pinyin": "huòjià guǎnlǐ",
      "meaning": "quản lý kệ hàng",
      "example": "我们需要货架管理。",
      "examplePinyin": "Wǒmen xūyào huòjià guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý kệ hàng."
    },
    {
      "word": "货架处理",
      "pinyin": "huòjià chǔlǐ",
      "meaning": "xử lý kệ hàng",
      "example": "我们需要货架处理。",
      "examplePinyin": "Wǒmen xūyào huòjià chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý kệ hàng."
    },
    {
      "word": "货架分析",
      "pinyin": "huòjià fēnxī",
      "meaning": "phân tích kệ hàng",
      "example": "我们需要货架分析。",
      "examplePinyin": "Wǒmen xūyào huòjià fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích kệ hàng."
    },
    {
      "word": "货架检查",
      "pinyin": "huòjià jiǎnchá",
      "meaning": "kiểm tra kệ hàng",
      "example": "我们需要货架检查。",
      "examplePinyin": "Wǒmen xūyào huòjià jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra kệ hàng."
    },
    {
      "word": "货架记录",
      "pinyin": "huòjià jìlù",
      "meaning": "ghi chép kệ hàng",
      "example": "我们需要货架记录。",
      "examplePinyin": "Wǒmen xūyào huòjià jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép kệ hàng."
    },
    {
      "word": "货架设置",
      "pinyin": "huòjià shèzhì",
      "meaning": "cài đặt kệ hàng",
      "example": "我们需要货架设置。",
      "examplePinyin": "Wǒmen xūyào huòjià shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt kệ hàng."
    },
    {
      "word": "货架更新",
      "pinyin": "huòjià gēngxīn",
      "meaning": "cập nhật kệ hàng",
      "example": "我们需要货架更新。",
      "examplePinyin": "Wǒmen xūyào huòjià gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật kệ hàng."
    },
    {
      "word": "货架优化",
      "pinyin": "huòjià yōuhuà",
      "meaning": "tối ưu hóa kệ hàng",
      "example": "我们需要货架优化。",
      "examplePinyin": "Wǒmen xūyào huòjià yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa kệ hàng."
    },
    {
      "word": "货架导入",
      "pinyin": "huòjià dǎorù",
      "meaning": "nhập vào kệ hàng",
      "example": "我们需要货架导入。",
      "examplePinyin": "Wǒmen xūyào huòjià dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào kệ hàng."
    },
    {
      "word": "货架导出",
      "pinyin": "huòjià dǎochū",
      "meaning": "xuất ra kệ hàng",
      "example": "我们需要货架导出。",
      "examplePinyin": "Wǒmen xūyào huòjià dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra kệ hàng."
    },
    {
      "word": "货架备份",
      "pinyin": "huòjià bèifèn",
      "meaning": "sao lưu kệ hàng",
      "example": "我们需要货架备份。",
      "examplePinyin": "Wǒmen xūyào huòjià bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu kệ hàng."
    },
    {
      "word": "货架同步",
      "pinyin": "huòjià tóngbù",
      "meaning": "đồng bộ kệ hàng",
      "example": "我们需要货架同步。",
      "examplePinyin": "Wǒmen xūyào huòjià tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ kệ hàng."
    },
    {
      "word": "货架搜索",
      "pinyin": "huòjià sōusuǒ",
      "meaning": "tìm kiếm kệ hàng",
      "example": "我们需要货架搜索。",
      "examplePinyin": "Wǒmen xūyào huòjià sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm kệ hàng."
    },
    {
      "word": "货架分类",
      "pinyin": "huòjià fēnlèi",
      "meaning": "phân loại kệ hàng",
      "example": "我们需要货架分类。",
      "examplePinyin": "Wǒmen xūyào huòjià fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại kệ hàng."
    },
    {
      "word": "货架统计",
      "pinyin": "huòjià tǒngjì",
      "meaning": "thống kê kệ hàng",
      "example": "我们需要货架统计。",
      "examplePinyin": "Wǒmen xūyào huòjià tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê kệ hàng."
    },
    {
      "word": "货架确认",
      "pinyin": "huòjià quèrèn",
      "meaning": "xác nhận kệ hàng",
      "example": "我们需要货架确认。",
      "examplePinyin": "Wǒmen xūyào huòjià quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận kệ hàng."
    },
    {
      "word": "货架审核",
      "pinyin": "huòjià shěnhé",
      "meaning": "duyệt/kiểm duyệt kệ hàng",
      "example": "我们需要货架审核。",
      "examplePinyin": "Wǒmen xūyào huòjià shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt kệ hàng."
    },
    {
      "word": "货架测试",
      "pinyin": "huòjià cèshì",
      "meaning": "kiểm thử kệ hàng",
      "example": "我们需要货架测试。",
      "examplePinyin": "Wǒmen xūyào huòjià cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử kệ hàng."
    },
    {
      "word": "货架维护",
      "pinyin": "huòjià wéihù",
      "meaning": "bảo trì kệ hàng",
      "example": "我们需要货架维护。",
      "examplePinyin": "Wǒmen xūyào huòjià wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì kệ hàng."
    },
    {
      "word": "货架设计",
      "pinyin": "huòjià shèjì",
      "meaning": "thiết kế kệ hàng",
      "example": "我们需要货架设计。",
      "examplePinyin": "Wǒmen xūyào huòjià shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế kệ hàng."
    },
    {
      "word": "货架开发",
      "pinyin": "huòjià kāifā",
      "meaning": "phát triển kệ hàng",
      "example": "我们需要货架开发。",
      "examplePinyin": "Wǒmen xūyào huòjià kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển kệ hàng."
    },
    {
      "word": "货架训练",
      "pinyin": "huòjià xùnliàn",
      "meaning": "huấn luyện kệ hàng",
      "example": "我们需要货架训练。",
      "examplePinyin": "Wǒmen xūyào huòjià xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện kệ hàng."
    },
    {
      "word": "货架识别",
      "pinyin": "huòjià shíbié",
      "meaning": "nhận dạng kệ hàng",
      "example": "我们需要货架识别。",
      "examplePinyin": "Wǒmen xūyào huòjià shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng kệ hàng."
    },
    {
      "word": "货架生成",
      "pinyin": "huòjià shēngchéng",
      "meaning": "tạo sinh kệ hàng",
      "example": "我们需要货架生成。",
      "examplePinyin": "Wǒmen xūyào huòjià shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh kệ hàng."
    },
    {
      "word": "货架通知",
      "pinyin": "huòjià tōngzhī",
      "meaning": "thông báo kệ hàng",
      "example": "我们需要货架通知。",
      "examplePinyin": "Wǒmen xūyào huòjià tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo kệ hàng."
    },
    {
      "word": "货架权限",
      "pinyin": "huòjià quánxiàn",
      "meaning": "quyền hạn kệ hàng",
      "example": "我们需要货架权限。",
      "examplePinyin": "Wǒmen xūyào huòjià quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn kệ hàng."
    },
    {
      "word": "货架状态",
      "pinyin": "huòjià zhuàngtài",
      "meaning": "trạng thái kệ hàng",
      "example": "我们需要货架状态。",
      "examplePinyin": "Wǒmen xūyào huòjià zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái kệ hàng."
    },
    {
      "word": "货架编号",
      "pinyin": "huòjià biānhào",
      "meaning": "mã số kệ hàng",
      "example": "我们需要货架编号。",
      "examplePinyin": "Wǒmen xūyào huòjià biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số kệ hàng."
    },
    {
      "word": "货架模板",
      "pinyin": "huòjià múbǎn",
      "meaning": "mẫu/template kệ hàng",
      "example": "我们需要货架模板。",
      "examplePinyin": "Wǒmen xūyào huòjià múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template kệ hàng."
    },
    {
      "word": "货架异常",
      "pinyin": "huòjià yìcháng",
      "meaning": "bất thường/lỗi kệ hàng",
      "example": "我们需要货架异常。",
      "examplePinyin": "Wǒmen xūyào huòjià yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi kệ hàng."
    },
    {
      "word": "路线管理",
      "pinyin": "lùxiàn guǎnlǐ",
      "meaning": "quản lý tuyến đường",
      "example": "我们需要路线管理。",
      "examplePinyin": "Wǒmen xūyào lùxiàn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tuyến đường."
    },
    {
      "word": "路线处理",
      "pinyin": "lùxiàn chǔlǐ",
      "meaning": "xử lý tuyến đường",
      "example": "我们需要路线处理。",
      "examplePinyin": "Wǒmen xūyào lùxiàn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tuyến đường."
    },
    {
      "word": "路线分析",
      "pinyin": "lùxiàn fēnxī",
      "meaning": "phân tích tuyến đường",
      "example": "我们需要路线分析。",
      "examplePinyin": "Wǒmen xūyào lùxiàn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tuyến đường."
    },
    {
      "word": "路线检查",
      "pinyin": "lùxiàn jiǎnchá",
      "meaning": "kiểm tra tuyến đường",
      "example": "我们需要路线检查。",
      "examplePinyin": "Wǒmen xūyào lùxiàn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tuyến đường."
    },
    {
      "word": "路线记录",
      "pinyin": "lùxiàn jìlù",
      "meaning": "ghi chép tuyến đường",
      "example": "我们需要路线记录。",
      "examplePinyin": "Wǒmen xūyào lùxiàn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tuyến đường."
    },
    {
      "word": "路线设置",
      "pinyin": "lùxiàn shèzhì",
      "meaning": "cài đặt tuyến đường",
      "example": "我们需要路线设置。",
      "examplePinyin": "Wǒmen xūyào lùxiàn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tuyến đường."
    },
    {
      "word": "路线更新",
      "pinyin": "lùxiàn gēngxīn",
      "meaning": "cập nhật tuyến đường",
      "example": "我们需要路线更新。",
      "examplePinyin": "Wǒmen xūyào lùxiàn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tuyến đường."
    },
    {
      "word": "路线优化",
      "pinyin": "lùxiàn yōuhuà",
      "meaning": "tối ưu hóa tuyến đường",
      "example": "我们需要路线优化。",
      "examplePinyin": "Wǒmen xūyào lùxiàn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tuyến đường."
    },
    {
      "word": "路线导入",
      "pinyin": "lùxiàn dǎorù",
      "meaning": "nhập vào tuyến đường",
      "example": "我们需要路线导入。",
      "examplePinyin": "Wǒmen xūyào lùxiàn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tuyến đường."
    },
    {
      "word": "路线导出",
      "pinyin": "lùxiàn dǎochū",
      "meaning": "xuất ra tuyến đường",
      "example": "我们需要路线导出。",
      "examplePinyin": "Wǒmen xūyào lùxiàn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tuyến đường."
    },
    {
      "word": "路线备份",
      "pinyin": "lùxiàn bèifèn",
      "meaning": "sao lưu tuyến đường",
      "example": "我们需要路线备份。",
      "examplePinyin": "Wǒmen xūyào lùxiàn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tuyến đường."
    },
    {
      "word": "路线同步",
      "pinyin": "lùxiàn tóngbù",
      "meaning": "đồng bộ tuyến đường",
      "example": "我们需要路线同步。",
      "examplePinyin": "Wǒmen xūyào lùxiàn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tuyến đường."
    },
    {
      "word": "路线搜索",
      "pinyin": "lùxiàn sōusuǒ",
      "meaning": "tìm kiếm tuyến đường",
      "example": "我们需要路线搜索。",
      "examplePinyin": "Wǒmen xūyào lùxiàn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tuyến đường."
    },
    {
      "word": "路线分类",
      "pinyin": "lùxiàn fēnlèi",
      "meaning": "phân loại tuyến đường",
      "example": "我们需要路线分类。",
      "examplePinyin": "Wǒmen xūyào lùxiàn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tuyến đường."
    },
    {
      "word": "路线统计",
      "pinyin": "lùxiàn tǒngjì",
      "meaning": "thống kê tuyến đường",
      "example": "我们需要路线统计。",
      "examplePinyin": "Wǒmen xūyào lùxiàn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tuyến đường."
    },
    {
      "word": "路线确认",
      "pinyin": "lùxiàn quèrèn",
      "meaning": "xác nhận tuyến đường",
      "example": "我们需要路线确认。",
      "examplePinyin": "Wǒmen xūyào lùxiàn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tuyến đường."
    },
    {
      "word": "路线审核",
      "pinyin": "lùxiàn shěnhé",
      "meaning": "duyệt/kiểm duyệt tuyến đường",
      "example": "我们需要路线审核。",
      "examplePinyin": "Wǒmen xūyào lùxiàn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tuyến đường."
    },
    {
      "word": "路线测试",
      "pinyin": "lùxiàn cèshì",
      "meaning": "kiểm thử tuyến đường",
      "example": "我们需要路线测试。",
      "examplePinyin": "Wǒmen xūyào lùxiàn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tuyến đường."
    },
    {
      "word": "路线维护",
      "pinyin": "lùxiàn wéihù",
      "meaning": "bảo trì tuyến đường",
      "example": "我们需要路线维护。",
      "examplePinyin": "Wǒmen xūyào lùxiàn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tuyến đường."
    },
    {
      "word": "路线设计",
      "pinyin": "lùxiàn shèjì",
      "meaning": "thiết kế tuyến đường",
      "example": "我们需要路线设计。",
      "examplePinyin": "Wǒmen xūyào lùxiàn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tuyến đường."
    },
    {
      "word": "路线开发",
      "pinyin": "lùxiàn kāifā",
      "meaning": "phát triển tuyến đường",
      "example": "我们需要路线开发。",
      "examplePinyin": "Wǒmen xūyào lùxiàn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tuyến đường."
    },
    {
      "word": "路线训练",
      "pinyin": "lùxiàn xùnliàn",
      "meaning": "huấn luyện tuyến đường",
      "example": "我们需要路线训练。",
      "examplePinyin": "Wǒmen xūyào lùxiàn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tuyến đường."
    },
    {
      "word": "路线识别",
      "pinyin": "lùxiàn shíbié",
      "meaning": "nhận dạng tuyến đường",
      "example": "我们需要路线识别。",
      "examplePinyin": "Wǒmen xūyào lùxiàn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tuyến đường."
    },
    {
      "word": "路线生成",
      "pinyin": "lùxiàn shēngchéng",
      "meaning": "tạo sinh tuyến đường",
      "example": "我们需要路线生成。",
      "examplePinyin": "Wǒmen xūyào lùxiàn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tuyến đường."
    },
    {
      "word": "路线通知",
      "pinyin": "lùxiàn tōngzhī",
      "meaning": "thông báo tuyến đường",
      "example": "我们需要路线通知。",
      "examplePinyin": "Wǒmen xūyào lùxiàn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tuyến đường."
    },
    {
      "word": "路线权限",
      "pinyin": "lùxiàn quánxiàn",
      "meaning": "quyền hạn tuyến đường",
      "example": "我们需要路线权限。",
      "examplePinyin": "Wǒmen xūyào lùxiàn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tuyến đường."
    },
    {
      "word": "路线状态",
      "pinyin": "lùxiàn zhuàngtài",
      "meaning": "trạng thái tuyến đường",
      "example": "我们需要路线状态。",
      "examplePinyin": "Wǒmen xūyào lùxiàn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tuyến đường."
    },
    {
      "word": "路线编号",
      "pinyin": "lùxiàn biānhào",
      "meaning": "mã số tuyến đường",
      "example": "我们需要路线编号。",
      "examplePinyin": "Wǒmen xūyào lùxiàn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tuyến đường."
    },
    {
      "word": "路线模板",
      "pinyin": "lùxiàn múbǎn",
      "meaning": "mẫu/template tuyến đường",
      "example": "我们需要路线模板。",
      "examplePinyin": "Wǒmen xūyào lùxiàn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tuyến đường."
    },
    {
      "word": "路线异常",
      "pinyin": "lùxiàn yìcháng",
      "meaning": "bất thường/lỗi tuyến đường",
      "example": "我们需要路线异常。",
      "examplePinyin": "Wǒmen xūyào lùxiàn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tuyến đường."
    },
    {
      "word": "司机管理",
      "pinyin": "sījī guǎnlǐ",
      "meaning": "quản lý tài xế",
      "example": "我们需要司机管理。",
      "examplePinyin": "Wǒmen xūyào sījī guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tài xế."
    },
    {
      "word": "司机处理",
      "pinyin": "sījī chǔlǐ",
      "meaning": "xử lý tài xế",
      "example": "我们需要司机处理。",
      "examplePinyin": "Wǒmen xūyào sījī chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tài xế."
    },
    {
      "word": "司机分析",
      "pinyin": "sījī fēnxī",
      "meaning": "phân tích tài xế",
      "example": "我们需要司机分析。",
      "examplePinyin": "Wǒmen xūyào sījī fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tài xế."
    },
    {
      "word": "司机检查",
      "pinyin": "sījī jiǎnchá",
      "meaning": "kiểm tra tài xế",
      "example": "我们需要司机检查。",
      "examplePinyin": "Wǒmen xūyào sījī jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tài xế."
    },
    {
      "word": "司机记录",
      "pinyin": "sījī jìlù",
      "meaning": "ghi chép tài xế",
      "example": "我们需要司机记录。",
      "examplePinyin": "Wǒmen xūyào sījī jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tài xế."
    },
    {
      "word": "司机设置",
      "pinyin": "sījī shèzhì",
      "meaning": "cài đặt tài xế",
      "example": "我们需要司机设置。",
      "examplePinyin": "Wǒmen xūyào sījī shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tài xế."
    },
    {
      "word": "司机更新",
      "pinyin": "sījī gēngxīn",
      "meaning": "cập nhật tài xế",
      "example": "我们需要司机更新。",
      "examplePinyin": "Wǒmen xūyào sījī gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tài xế."
    },
    {
      "word": "司机优化",
      "pinyin": "sījī yōuhuà",
      "meaning": "tối ưu hóa tài xế",
      "example": "我们需要司机优化。",
      "examplePinyin": "Wǒmen xūyào sījī yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tài xế."
    },
    {
      "word": "司机导入",
      "pinyin": "sījī dǎorù",
      "meaning": "nhập vào tài xế",
      "example": "我们需要司机导入。",
      "examplePinyin": "Wǒmen xūyào sījī dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tài xế."
    },
    {
      "word": "司机导出",
      "pinyin": "sījī dǎochū",
      "meaning": "xuất ra tài xế",
      "example": "我们需要司机导出。",
      "examplePinyin": "Wǒmen xūyào sījī dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tài xế."
    },
    {
      "word": "司机备份",
      "pinyin": "sījī bèifèn",
      "meaning": "sao lưu tài xế",
      "example": "我们需要司机备份。",
      "examplePinyin": "Wǒmen xūyào sījī bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tài xế."
    },
    {
      "word": "司机同步",
      "pinyin": "sījī tóngbù",
      "meaning": "đồng bộ tài xế",
      "example": "我们需要司机同步。",
      "examplePinyin": "Wǒmen xūyào sījī tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tài xế."
    },
    {
      "word": "司机搜索",
      "pinyin": "sījī sōusuǒ",
      "meaning": "tìm kiếm tài xế",
      "example": "我们需要司机搜索。",
      "examplePinyin": "Wǒmen xūyào sījī sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tài xế."
    },
    {
      "word": "司机分类",
      "pinyin": "sījī fēnlèi",
      "meaning": "phân loại tài xế",
      "example": "我们需要司机分类。",
      "examplePinyin": "Wǒmen xūyào sījī fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tài xế."
    },
    {
      "word": "司机统计",
      "pinyin": "sījī tǒngjì",
      "meaning": "thống kê tài xế",
      "example": "我们需要司机统计。",
      "examplePinyin": "Wǒmen xūyào sījī tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tài xế."
    },
    {
      "word": "司机确认",
      "pinyin": "sījī quèrèn",
      "meaning": "xác nhận tài xế",
      "example": "我们需要司机确认。",
      "examplePinyin": "Wǒmen xūyào sījī quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tài xế."
    },
    {
      "word": "司机审核",
      "pinyin": "sījī shěnhé",
      "meaning": "duyệt/kiểm duyệt tài xế",
      "example": "我们需要司机审核。",
      "examplePinyin": "Wǒmen xūyào sījī shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tài xế."
    },
    {
      "word": "司机测试",
      "pinyin": "sījī cèshì",
      "meaning": "kiểm thử tài xế",
      "example": "我们需要司机测试。",
      "examplePinyin": "Wǒmen xūyào sījī cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tài xế."
    },
    {
      "word": "司机维护",
      "pinyin": "sījī wéihù",
      "meaning": "bảo trì tài xế",
      "example": "我们需要司机维护。",
      "examplePinyin": "Wǒmen xūyào sījī wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tài xế."
    },
    {
      "word": "司机设计",
      "pinyin": "sījī shèjì",
      "meaning": "thiết kế tài xế",
      "example": "我们需要司机设计。",
      "examplePinyin": "Wǒmen xūyào sījī shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tài xế."
    },
    {
      "word": "司机开发",
      "pinyin": "sījī kāifā",
      "meaning": "phát triển tài xế",
      "example": "我们需要司机开发。",
      "examplePinyin": "Wǒmen xūyào sījī kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tài xế."
    },
    {
      "word": "司机训练",
      "pinyin": "sījī xùnliàn",
      "meaning": "huấn luyện tài xế",
      "example": "我们需要司机训练。",
      "examplePinyin": "Wǒmen xūyào sījī xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tài xế."
    },
    {
      "word": "司机识别",
      "pinyin": "sījī shíbié",
      "meaning": "nhận dạng tài xế",
      "example": "我们需要司机识别。",
      "examplePinyin": "Wǒmen xūyào sījī shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tài xế."
    },
    {
      "word": "司机生成",
      "pinyin": "sījī shēngchéng",
      "meaning": "tạo sinh tài xế",
      "example": "我们需要司机生成。",
      "examplePinyin": "Wǒmen xūyào sījī shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tài xế."
    },
    {
      "word": "司机通知",
      "pinyin": "sījī tōngzhī",
      "meaning": "thông báo tài xế",
      "example": "我们需要司机通知。",
      "examplePinyin": "Wǒmen xūyào sījī tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tài xế."
    },
    {
      "word": "司机权限",
      "pinyin": "sījī quánxiàn",
      "meaning": "quyền hạn tài xế",
      "example": "我们需要司机权限。",
      "examplePinyin": "Wǒmen xūyào sījī quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tài xế."
    },
    {
      "word": "司机状态",
      "pinyin": "sījī zhuàngtài",
      "meaning": "trạng thái tài xế",
      "example": "我们需要司机状态。",
      "examplePinyin": "Wǒmen xūyào sījī zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tài xế."
    },
    {
      "word": "司机编号",
      "pinyin": "sījī biānhào",
      "meaning": "mã số tài xế",
      "example": "我们需要司机编号。",
      "examplePinyin": "Wǒmen xūyào sījī biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tài xế."
    },
    {
      "word": "司机模板",
      "pinyin": "sījī múbǎn",
      "meaning": "mẫu/template tài xế",
      "example": "我们需要司机模板。",
      "examplePinyin": "Wǒmen xūyào sījī múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tài xế."
    },
    {
      "word": "司机异常",
      "pinyin": "sījī yìcháng",
      "meaning": "bất thường/lỗi tài xế",
      "example": "我们需要司机异常。",
      "examplePinyin": "Wǒmen xūyào sījī yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tài xế."
    },
    {
      "word": "车辆管理",
      "pinyin": "chēliàng guǎnlǐ",
      "meaning": "quản lý phương tiện",
      "example": "我们需要车辆管理。",
      "examplePinyin": "Wǒmen xūyào chēliàng guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý phương tiện."
    },
    {
      "word": "车辆处理",
      "pinyin": "chēliàng chǔlǐ",
      "meaning": "xử lý phương tiện",
      "example": "我们需要车辆处理。",
      "examplePinyin": "Wǒmen xūyào chēliàng chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý phương tiện."
    },
    {
      "word": "车辆分析",
      "pinyin": "chēliàng fēnxī",
      "meaning": "phân tích phương tiện",
      "example": "我们需要车辆分析。",
      "examplePinyin": "Wǒmen xūyào chēliàng fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích phương tiện."
    },
    {
      "word": "车辆检查",
      "pinyin": "chēliàng jiǎnchá",
      "meaning": "kiểm tra phương tiện",
      "example": "我们需要车辆检查。",
      "examplePinyin": "Wǒmen xūyào chēliàng jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra phương tiện."
    },
    {
      "word": "车辆记录",
      "pinyin": "chēliàng jìlù",
      "meaning": "ghi chép phương tiện",
      "example": "我们需要车辆记录。",
      "examplePinyin": "Wǒmen xūyào chēliàng jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép phương tiện."
    },
    {
      "word": "车辆设置",
      "pinyin": "chēliàng shèzhì",
      "meaning": "cài đặt phương tiện",
      "example": "我们需要车辆设置。",
      "examplePinyin": "Wǒmen xūyào chēliàng shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt phương tiện."
    },
    {
      "word": "车辆更新",
      "pinyin": "chēliàng gēngxīn",
      "meaning": "cập nhật phương tiện",
      "example": "我们需要车辆更新。",
      "examplePinyin": "Wǒmen xūyào chēliàng gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật phương tiện."
    },
    {
      "word": "车辆优化",
      "pinyin": "chēliàng yōuhuà",
      "meaning": "tối ưu hóa phương tiện",
      "example": "我们需要车辆优化。",
      "examplePinyin": "Wǒmen xūyào chēliàng yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa phương tiện."
    },
    {
      "word": "车辆导入",
      "pinyin": "chēliàng dǎorù",
      "meaning": "nhập vào phương tiện",
      "example": "我们需要车辆导入。",
      "examplePinyin": "Wǒmen xūyào chēliàng dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào phương tiện."
    },
    {
      "word": "车辆导出",
      "pinyin": "chēliàng dǎochū",
      "meaning": "xuất ra phương tiện",
      "example": "我们需要车辆导出。",
      "examplePinyin": "Wǒmen xūyào chēliàng dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra phương tiện."
    },
    {
      "word": "车辆备份",
      "pinyin": "chēliàng bèifèn",
      "meaning": "sao lưu phương tiện",
      "example": "我们需要车辆备份。",
      "examplePinyin": "Wǒmen xūyào chēliàng bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu phương tiện."
    },
    {
      "word": "车辆同步",
      "pinyin": "chēliàng tóngbù",
      "meaning": "đồng bộ phương tiện",
      "example": "我们需要车辆同步。",
      "examplePinyin": "Wǒmen xūyào chēliàng tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ phương tiện."
    },
    {
      "word": "车辆搜索",
      "pinyin": "chēliàng sōusuǒ",
      "meaning": "tìm kiếm phương tiện",
      "example": "我们需要车辆搜索。",
      "examplePinyin": "Wǒmen xūyào chēliàng sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm phương tiện."
    },
    {
      "word": "车辆分类",
      "pinyin": "chēliàng fēnlèi",
      "meaning": "phân loại phương tiện",
      "example": "我们需要车辆分类。",
      "examplePinyin": "Wǒmen xūyào chēliàng fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại phương tiện."
    },
    {
      "word": "车辆统计",
      "pinyin": "chēliàng tǒngjì",
      "meaning": "thống kê phương tiện",
      "example": "我们需要车辆统计。",
      "examplePinyin": "Wǒmen xūyào chēliàng tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê phương tiện."
    },
    {
      "word": "车辆确认",
      "pinyin": "chēliàng quèrèn",
      "meaning": "xác nhận phương tiện",
      "example": "我们需要车辆确认。",
      "examplePinyin": "Wǒmen xūyào chēliàng quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận phương tiện."
    },
    {
      "word": "车辆审核",
      "pinyin": "chēliàng shěnhé",
      "meaning": "duyệt/kiểm duyệt phương tiện",
      "example": "我们需要车辆审核。",
      "examplePinyin": "Wǒmen xūyào chēliàng shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt phương tiện."
    },
    {
      "word": "车辆测试",
      "pinyin": "chēliàng cèshì",
      "meaning": "kiểm thử phương tiện",
      "example": "我们需要车辆测试。",
      "examplePinyin": "Wǒmen xūyào chēliàng cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử phương tiện."
    },
    {
      "word": "车辆维护",
      "pinyin": "chēliàng wéihù",
      "meaning": "bảo trì phương tiện",
      "example": "我们需要车辆维护。",
      "examplePinyin": "Wǒmen xūyào chēliàng wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì phương tiện."
    },
    {
      "word": "车辆设计",
      "pinyin": "chēliàng shèjì",
      "meaning": "thiết kế phương tiện",
      "example": "我们需要车辆设计。",
      "examplePinyin": "Wǒmen xūyào chēliàng shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế phương tiện."
    },
    {
      "word": "车辆开发",
      "pinyin": "chēliàng kāifā",
      "meaning": "phát triển phương tiện",
      "example": "我们需要车辆开发。",
      "examplePinyin": "Wǒmen xūyào chēliàng kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển phương tiện."
    },
    {
      "word": "车辆训练",
      "pinyin": "chēliàng xùnliàn",
      "meaning": "huấn luyện phương tiện",
      "example": "我们需要车辆训练。",
      "examplePinyin": "Wǒmen xūyào chēliàng xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện phương tiện."
    },
    {
      "word": "车辆识别",
      "pinyin": "chēliàng shíbié",
      "meaning": "nhận dạng phương tiện",
      "example": "我们需要车辆识别。",
      "examplePinyin": "Wǒmen xūyào chēliàng shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng phương tiện."
    },
    {
      "word": "车辆生成",
      "pinyin": "chēliàng shēngchéng",
      "meaning": "tạo sinh phương tiện",
      "example": "我们需要车辆生成。",
      "examplePinyin": "Wǒmen xūyào chēliàng shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh phương tiện."
    },
    {
      "word": "车辆通知",
      "pinyin": "chēliàng tōngzhī",
      "meaning": "thông báo phương tiện",
      "example": "我们需要车辆通知。",
      "examplePinyin": "Wǒmen xūyào chēliàng tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo phương tiện."
    },
    {
      "word": "车辆权限",
      "pinyin": "chēliàng quánxiàn",
      "meaning": "quyền hạn phương tiện",
      "example": "我们需要车辆权限。",
      "examplePinyin": "Wǒmen xūyào chēliàng quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn phương tiện."
    },
    {
      "word": "车辆状态",
      "pinyin": "chēliàng zhuàngtài",
      "meaning": "trạng thái phương tiện",
      "example": "我们需要车辆状态。",
      "examplePinyin": "Wǒmen xūyào chēliàng zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái phương tiện."
    },
    {
      "word": "车辆编号",
      "pinyin": "chēliàng biānhào",
      "meaning": "mã số phương tiện",
      "example": "我们需要车辆编号。",
      "examplePinyin": "Wǒmen xūyào chēliàng biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số phương tiện."
    },
    {
      "word": "车辆模板",
      "pinyin": "chēliàng múbǎn",
      "meaning": "mẫu/template phương tiện",
      "example": "我们需要车辆模板。",
      "examplePinyin": "Wǒmen xūyào chēliàng múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template phương tiện."
    },
    {
      "word": "车辆异常",
      "pinyin": "chēliàng yìcháng",
      "meaning": "bất thường/lỗi phương tiện",
      "example": "我们需要车辆异常。",
      "examplePinyin": "Wǒmen xūyào chēliàng yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi phương tiện."
    },
    {
      "word": "地址管理",
      "pinyin": "dìzhǐ guǎnlǐ",
      "meaning": "quản lý địa chỉ",
      "example": "我们需要地址管理。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý địa chỉ."
    },
    {
      "word": "地址处理",
      "pinyin": "dìzhǐ chǔlǐ",
      "meaning": "xử lý địa chỉ",
      "example": "我们需要地址处理。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý địa chỉ."
    },
    {
      "word": "地址分析",
      "pinyin": "dìzhǐ fēnxī",
      "meaning": "phân tích địa chỉ",
      "example": "我们需要地址分析。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích địa chỉ."
    },
    {
      "word": "地址检查",
      "pinyin": "dìzhǐ jiǎnchá",
      "meaning": "kiểm tra địa chỉ",
      "example": "我们需要地址检查。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra địa chỉ."
    },
    {
      "word": "地址记录",
      "pinyin": "dìzhǐ jìlù",
      "meaning": "ghi chép địa chỉ",
      "example": "我们需要地址记录。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép địa chỉ."
    },
    {
      "word": "地址设置",
      "pinyin": "dìzhǐ shèzhì",
      "meaning": "cài đặt địa chỉ",
      "example": "我们需要地址设置。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt địa chỉ."
    },
    {
      "word": "地址更新",
      "pinyin": "dìzhǐ gēngxīn",
      "meaning": "cập nhật địa chỉ",
      "example": "我们需要地址更新。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật địa chỉ."
    },
    {
      "word": "地址优化",
      "pinyin": "dìzhǐ yōuhuà",
      "meaning": "tối ưu hóa địa chỉ",
      "example": "我们需要地址优化。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa địa chỉ."
    },
    {
      "word": "地址导入",
      "pinyin": "dìzhǐ dǎorù",
      "meaning": "nhập vào địa chỉ",
      "example": "我们需要地址导入。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào địa chỉ."
    },
    {
      "word": "地址导出",
      "pinyin": "dìzhǐ dǎochū",
      "meaning": "xuất ra địa chỉ",
      "example": "我们需要地址导出。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra địa chỉ."
    },
    {
      "word": "地址备份",
      "pinyin": "dìzhǐ bèifèn",
      "meaning": "sao lưu địa chỉ",
      "example": "我们需要地址备份。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu địa chỉ."
    },
    {
      "word": "地址同步",
      "pinyin": "dìzhǐ tóngbù",
      "meaning": "đồng bộ địa chỉ",
      "example": "我们需要地址同步。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ địa chỉ."
    },
    {
      "word": "地址搜索",
      "pinyin": "dìzhǐ sōusuǒ",
      "meaning": "tìm kiếm địa chỉ",
      "example": "我们需要地址搜索。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm địa chỉ."
    },
    {
      "word": "地址分类",
      "pinyin": "dìzhǐ fēnlèi",
      "meaning": "phân loại địa chỉ",
      "example": "我们需要地址分类。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại địa chỉ."
    },
    {
      "word": "地址统计",
      "pinyin": "dìzhǐ tǒngjì",
      "meaning": "thống kê địa chỉ",
      "example": "我们需要地址统计。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê địa chỉ."
    },
    {
      "word": "地址确认",
      "pinyin": "dìzhǐ quèrèn",
      "meaning": "xác nhận địa chỉ",
      "example": "我们需要地址确认。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận địa chỉ."
    },
    {
      "word": "地址审核",
      "pinyin": "dìzhǐ shěnhé",
      "meaning": "duyệt/kiểm duyệt địa chỉ",
      "example": "我们需要地址审核。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt địa chỉ."
    },
    {
      "word": "地址测试",
      "pinyin": "dìzhǐ cèshì",
      "meaning": "kiểm thử địa chỉ",
      "example": "我们需要地址测试。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử địa chỉ."
    },
    {
      "word": "地址维护",
      "pinyin": "dìzhǐ wéihù",
      "meaning": "bảo trì địa chỉ",
      "example": "我们需要地址维护。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì địa chỉ."
    },
    {
      "word": "地址设计",
      "pinyin": "dìzhǐ shèjì",
      "meaning": "thiết kế địa chỉ",
      "example": "我们需要地址设计。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế địa chỉ."
    },
    {
      "word": "地址开发",
      "pinyin": "dìzhǐ kāifā",
      "meaning": "phát triển địa chỉ",
      "example": "我们需要地址开发。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển địa chỉ."
    },
    {
      "word": "地址训练",
      "pinyin": "dìzhǐ xùnliàn",
      "meaning": "huấn luyện địa chỉ",
      "example": "我们需要地址训练。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện địa chỉ."
    },
    {
      "word": "地址识别",
      "pinyin": "dìzhǐ shíbié",
      "meaning": "nhận dạng địa chỉ",
      "example": "我们需要地址识别。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng địa chỉ."
    },
    {
      "word": "地址生成",
      "pinyin": "dìzhǐ shēngchéng",
      "meaning": "tạo sinh địa chỉ",
      "example": "我们需要地址生成。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh địa chỉ."
    },
    {
      "word": "地址通知",
      "pinyin": "dìzhǐ tōngzhī",
      "meaning": "thông báo địa chỉ",
      "example": "我们需要地址通知。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo địa chỉ."
    },
    {
      "word": "地址权限",
      "pinyin": "dìzhǐ quánxiàn",
      "meaning": "quyền hạn địa chỉ",
      "example": "我们需要地址权限。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn địa chỉ."
    },
    {
      "word": "地址状态",
      "pinyin": "dìzhǐ zhuàngtài",
      "meaning": "trạng thái địa chỉ",
      "example": "我们需要地址状态。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái địa chỉ."
    },
    {
      "word": "地址编号",
      "pinyin": "dìzhǐ biānhào",
      "meaning": "mã số địa chỉ",
      "example": "我们需要地址编号。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số địa chỉ."
    },
    {
      "word": "地址模板",
      "pinyin": "dìzhǐ múbǎn",
      "meaning": "mẫu/template địa chỉ",
      "example": "我们需要地址模板。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template địa chỉ."
    },
    {
      "word": "地址异常",
      "pinyin": "dìzhǐ yìcháng",
      "meaning": "bất thường/lỗi địa chỉ",
      "example": "我们需要地址异常。",
      "examplePinyin": "Wǒmen xūyào dìzhǐ yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi địa chỉ."
    },
    {
      "word": "发票管理",
      "pinyin": "fāpiào guǎnlǐ",
      "meaning": "quản lý hóa đơn",
      "example": "我们需要发票管理。",
      "examplePinyin": "Wǒmen xūyào fāpiào guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hóa đơn."
    },
    {
      "word": "发票处理",
      "pinyin": "fāpiào chǔlǐ",
      "meaning": "xử lý hóa đơn",
      "example": "我们需要发票处理。",
      "examplePinyin": "Wǒmen xūyào fāpiào chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hóa đơn."
    },
    {
      "word": "发票分析",
      "pinyin": "fāpiào fēnxī",
      "meaning": "phân tích hóa đơn",
      "example": "我们需要发票分析。",
      "examplePinyin": "Wǒmen xūyào fāpiào fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hóa đơn."
    },
    {
      "word": "发票检查",
      "pinyin": "fāpiào jiǎnchá",
      "meaning": "kiểm tra hóa đơn",
      "example": "我们需要发票检查。",
      "examplePinyin": "Wǒmen xūyào fāpiào jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hóa đơn."
    },
    {
      "word": "发票记录",
      "pinyin": "fāpiào jìlù",
      "meaning": "ghi chép hóa đơn",
      "example": "我们需要发票记录。",
      "examplePinyin": "Wǒmen xūyào fāpiào jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hóa đơn."
    },
    {
      "word": "发票设置",
      "pinyin": "fāpiào shèzhì",
      "meaning": "cài đặt hóa đơn",
      "example": "我们需要发票设置。",
      "examplePinyin": "Wǒmen xūyào fāpiào shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hóa đơn."
    },
    {
      "word": "发票更新",
      "pinyin": "fāpiào gēngxīn",
      "meaning": "cập nhật hóa đơn",
      "example": "我们需要发票更新。",
      "examplePinyin": "Wǒmen xūyào fāpiào gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hóa đơn."
    },
    {
      "word": "发票优化",
      "pinyin": "fāpiào yōuhuà",
      "meaning": "tối ưu hóa hóa đơn",
      "example": "我们需要发票优化。",
      "examplePinyin": "Wǒmen xūyào fāpiào yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hóa đơn."
    },
    {
      "word": "发票导入",
      "pinyin": "fāpiào dǎorù",
      "meaning": "nhập vào hóa đơn",
      "example": "我们需要发票导入。",
      "examplePinyin": "Wǒmen xūyào fāpiào dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hóa đơn."
    },
    {
      "word": "发票导出",
      "pinyin": "fāpiào dǎochū",
      "meaning": "xuất ra hóa đơn",
      "example": "我们需要发票导出。",
      "examplePinyin": "Wǒmen xūyào fāpiào dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hóa đơn."
    },
    {
      "word": "发票备份",
      "pinyin": "fāpiào bèifèn",
      "meaning": "sao lưu hóa đơn",
      "example": "我们需要发票备份。",
      "examplePinyin": "Wǒmen xūyào fāpiào bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu hóa đơn."
    },
    {
      "word": "发票同步",
      "pinyin": "fāpiào tóngbù",
      "meaning": "đồng bộ hóa đơn",
      "example": "我们需要发票同步。",
      "examplePinyin": "Wǒmen xūyào fāpiào tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ hóa đơn."
    },
    {
      "word": "发票搜索",
      "pinyin": "fāpiào sōusuǒ",
      "meaning": "tìm kiếm hóa đơn",
      "example": "我们需要发票搜索。",
      "examplePinyin": "Wǒmen xūyào fāpiào sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm hóa đơn."
    },
    {
      "word": "发票分类",
      "pinyin": "fāpiào fēnlèi",
      "meaning": "phân loại hóa đơn",
      "example": "我们需要发票分类。",
      "examplePinyin": "Wǒmen xūyào fāpiào fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại hóa đơn."
    },
    {
      "word": "发票统计",
      "pinyin": "fāpiào tǒngjì",
      "meaning": "thống kê hóa đơn",
      "example": "我们需要发票统计。",
      "examplePinyin": "Wǒmen xūyào fāpiào tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê hóa đơn."
    },
    {
      "word": "发票确认",
      "pinyin": "fāpiào quèrèn",
      "meaning": "xác nhận hóa đơn",
      "example": "我们需要发票确认。",
      "examplePinyin": "Wǒmen xūyào fāpiào quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận hóa đơn."
    },
    {
      "word": "发票审核",
      "pinyin": "fāpiào shěnhé",
      "meaning": "duyệt/kiểm duyệt hóa đơn",
      "example": "我们需要发票审核。",
      "examplePinyin": "Wǒmen xūyào fāpiào shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt hóa đơn."
    },
    {
      "word": "发票测试",
      "pinyin": "fāpiào cèshì",
      "meaning": "kiểm thử hóa đơn",
      "example": "我们需要发票测试。",
      "examplePinyin": "Wǒmen xūyào fāpiào cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử hóa đơn."
    },
    {
      "word": "发票维护",
      "pinyin": "fāpiào wéihù",
      "meaning": "bảo trì hóa đơn",
      "example": "我们需要发票维护。",
      "examplePinyin": "Wǒmen xūyào fāpiào wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì hóa đơn."
    },
    {
      "word": "发票设计",
      "pinyin": "fāpiào shèjì",
      "meaning": "thiết kế hóa đơn",
      "example": "我们需要发票设计。",
      "examplePinyin": "Wǒmen xūyào fāpiào shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế hóa đơn."
    },
    {
      "word": "发票开发",
      "pinyin": "fāpiào kāifā",
      "meaning": "phát triển hóa đơn",
      "example": "我们需要发票开发。",
      "examplePinyin": "Wǒmen xūyào fāpiào kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển hóa đơn."
    },
    {
      "word": "发票训练",
      "pinyin": "fāpiào xùnliàn",
      "meaning": "huấn luyện hóa đơn",
      "example": "我们需要发票训练。",
      "examplePinyin": "Wǒmen xūyào fāpiào xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện hóa đơn."
    },
    {
      "word": "发票识别",
      "pinyin": "fāpiào shíbié",
      "meaning": "nhận dạng hóa đơn",
      "example": "我们需要发票识别。",
      "examplePinyin": "Wǒmen xūyào fāpiào shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng hóa đơn."
    },
    {
      "word": "发票生成",
      "pinyin": "fāpiào shēngchéng",
      "meaning": "tạo sinh hóa đơn",
      "example": "我们需要发票生成。",
      "examplePinyin": "Wǒmen xūyào fāpiào shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh hóa đơn."
    },
    {
      "word": "发票通知",
      "pinyin": "fāpiào tōngzhī",
      "meaning": "thông báo hóa đơn",
      "example": "我们需要发票通知。",
      "examplePinyin": "Wǒmen xūyào fāpiào tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo hóa đơn."
    },
    {
      "word": "发票权限",
      "pinyin": "fāpiào quánxiàn",
      "meaning": "quyền hạn hóa đơn",
      "example": "我们需要发票权限。",
      "examplePinyin": "Wǒmen xūyào fāpiào quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn hóa đơn."
    },
    {
      "word": "发票状态",
      "pinyin": "fāpiào zhuàngtài",
      "meaning": "trạng thái hóa đơn",
      "example": "我们需要发票状态。",
      "examplePinyin": "Wǒmen xūyào fāpiào zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái hóa đơn."
    },
    {
      "word": "发票编号",
      "pinyin": "fāpiào biānhào",
      "meaning": "mã số hóa đơn",
      "example": "我们需要发票编号。",
      "examplePinyin": "Wǒmen xūyào fāpiào biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số hóa đơn."
    },
    {
      "word": "发票模板",
      "pinyin": "fāpiào múbǎn",
      "meaning": "mẫu/template hóa đơn",
      "example": "我们需要发票模板。",
      "examplePinyin": "Wǒmen xūyào fāpiào múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template hóa đơn."
    },
    {
      "word": "发票异常",
      "pinyin": "fāpiào yìcháng",
      "meaning": "bất thường/lỗi hóa đơn",
      "example": "我们需要发票异常。",
      "examplePinyin": "Wǒmen xūyào fāpiào yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi hóa đơn."
    },
    {
      "word": "退款管理",
      "pinyin": "tuìkuǎn guǎnlǐ",
      "meaning": "quản lý hoàn tiền",
      "example": "我们需要退款管理。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hoàn tiền."
    },
    {
      "word": "退款处理",
      "pinyin": "tuìkuǎn chǔlǐ",
      "meaning": "xử lý hoàn tiền",
      "example": "我们需要退款处理。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hoàn tiền."
    },
    {
      "word": "退款分析",
      "pinyin": "tuìkuǎn fēnxī",
      "meaning": "phân tích hoàn tiền",
      "example": "我们需要退款分析。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hoàn tiền."
    },
    {
      "word": "退款检查",
      "pinyin": "tuìkuǎn jiǎnchá",
      "meaning": "kiểm tra hoàn tiền",
      "example": "我们需要退款检查。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hoàn tiền."
    },
    {
      "word": "退款记录",
      "pinyin": "tuìkuǎn jìlù",
      "meaning": "ghi chép hoàn tiền",
      "example": "我们需要退款记录。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hoàn tiền."
    },
    {
      "word": "退款设置",
      "pinyin": "tuìkuǎn shèzhì",
      "meaning": "cài đặt hoàn tiền",
      "example": "我们需要退款设置。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hoàn tiền."
    },
    {
      "word": "退款更新",
      "pinyin": "tuìkuǎn gēngxīn",
      "meaning": "cập nhật hoàn tiền",
      "example": "我们需要退款更新。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hoàn tiền."
    },
    {
      "word": "退款优化",
      "pinyin": "tuìkuǎn yōuhuà",
      "meaning": "tối ưu hóa hoàn tiền",
      "example": "我们需要退款优化。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hoàn tiền."
    },
    {
      "word": "退款导入",
      "pinyin": "tuìkuǎn dǎorù",
      "meaning": "nhập vào hoàn tiền",
      "example": "我们需要退款导入。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hoàn tiền."
    },
    {
      "word": "退款导出",
      "pinyin": "tuìkuǎn dǎochū",
      "meaning": "xuất ra hoàn tiền",
      "example": "我们需要退款导出。",
      "examplePinyin": "Wǒmen xūyào tuìkuǎn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hoàn tiền."
    }
  ],
  "chuyen_nganh_cntt_ai": [
    {
      "word": "数据管理",
      "pinyin": "shùjù guǎnlǐ",
      "meaning": "quản lý dữ liệu",
      "example": "我们需要数据管理。",
      "examplePinyin": "Wǒmen xūyào shùjù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý dữ liệu."
    },
    {
      "word": "数据处理",
      "pinyin": "shùjù chǔlǐ",
      "meaning": "xử lý dữ liệu",
      "example": "我们需要数据处理。",
      "examplePinyin": "Wǒmen xūyào shùjù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý dữ liệu."
    },
    {
      "word": "数据分析",
      "pinyin": "shùjù fēnxī",
      "meaning": "phân tích dữ liệu",
      "example": "我们需要数据分析。",
      "examplePinyin": "Wǒmen xūyào shùjù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích dữ liệu."
    },
    {
      "word": "数据检查",
      "pinyin": "shùjù jiǎnchá",
      "meaning": "kiểm tra dữ liệu",
      "example": "我们需要数据检查。",
      "examplePinyin": "Wǒmen xūyào shùjù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra dữ liệu."
    },
    {
      "word": "数据记录",
      "pinyin": "shùjù jìlù",
      "meaning": "ghi chép dữ liệu",
      "example": "我们需要数据记录。",
      "examplePinyin": "Wǒmen xūyào shùjù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép dữ liệu."
    },
    {
      "word": "数据设置",
      "pinyin": "shùjù shèzhì",
      "meaning": "cài đặt dữ liệu",
      "example": "我们需要数据设置。",
      "examplePinyin": "Wǒmen xūyào shùjù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt dữ liệu."
    },
    {
      "word": "数据更新",
      "pinyin": "shùjù gēngxīn",
      "meaning": "cập nhật dữ liệu",
      "example": "我们需要数据更新。",
      "examplePinyin": "Wǒmen xūyào shùjù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật dữ liệu."
    },
    {
      "word": "数据优化",
      "pinyin": "shùjù yōuhuà",
      "meaning": "tối ưu hóa dữ liệu",
      "example": "我们需要数据优化。",
      "examplePinyin": "Wǒmen xūyào shùjù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa dữ liệu."
    },
    {
      "word": "数据导入",
      "pinyin": "shùjù dǎorù",
      "meaning": "nhập vào dữ liệu",
      "example": "我们需要数据导入。",
      "examplePinyin": "Wǒmen xūyào shùjù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào dữ liệu."
    },
    {
      "word": "数据导出",
      "pinyin": "shùjù dǎochū",
      "meaning": "xuất ra dữ liệu",
      "example": "我们需要数据导出。",
      "examplePinyin": "Wǒmen xūyào shùjù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra dữ liệu."
    },
    {
      "word": "数据备份",
      "pinyin": "shùjù bèifèn",
      "meaning": "sao lưu dữ liệu",
      "example": "我们需要数据备份。",
      "examplePinyin": "Wǒmen xūyào shùjù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu dữ liệu."
    },
    {
      "word": "数据同步",
      "pinyin": "shùjù tóngbù",
      "meaning": "đồng bộ dữ liệu",
      "example": "我们需要数据同步。",
      "examplePinyin": "Wǒmen xūyào shùjù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ dữ liệu."
    },
    {
      "word": "数据搜索",
      "pinyin": "shùjù sōusuǒ",
      "meaning": "tìm kiếm dữ liệu",
      "example": "我们需要数据搜索。",
      "examplePinyin": "Wǒmen xūyào shùjù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm dữ liệu."
    },
    {
      "word": "数据分类",
      "pinyin": "shùjù fēnlèi",
      "meaning": "phân loại dữ liệu",
      "example": "我们需要数据分类。",
      "examplePinyin": "Wǒmen xūyào shùjù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại dữ liệu."
    },
    {
      "word": "数据统计",
      "pinyin": "shùjù tǒngjì",
      "meaning": "thống kê dữ liệu",
      "example": "我们需要数据统计。",
      "examplePinyin": "Wǒmen xūyào shùjù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê dữ liệu."
    },
    {
      "word": "数据确认",
      "pinyin": "shùjù quèrèn",
      "meaning": "xác nhận dữ liệu",
      "example": "我们需要数据确认。",
      "examplePinyin": "Wǒmen xūyào shùjù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận dữ liệu."
    },
    {
      "word": "数据审核",
      "pinyin": "shùjù shěnhé",
      "meaning": "duyệt/kiểm duyệt dữ liệu",
      "example": "我们需要数据审核。",
      "examplePinyin": "Wǒmen xūyào shùjù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt dữ liệu."
    },
    {
      "word": "数据测试",
      "pinyin": "shùjù cèshì",
      "meaning": "kiểm thử dữ liệu",
      "example": "我们需要数据测试。",
      "examplePinyin": "Wǒmen xūyào shùjù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử dữ liệu."
    },
    {
      "word": "数据维护",
      "pinyin": "shùjù wéihù",
      "meaning": "bảo trì dữ liệu",
      "example": "我们需要数据维护。",
      "examplePinyin": "Wǒmen xūyào shùjù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì dữ liệu."
    },
    {
      "word": "数据设计",
      "pinyin": "shùjù shèjì",
      "meaning": "thiết kế dữ liệu",
      "example": "我们需要数据设计。",
      "examplePinyin": "Wǒmen xūyào shùjù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế dữ liệu."
    },
    {
      "word": "数据开发",
      "pinyin": "shùjù kāifā",
      "meaning": "phát triển dữ liệu",
      "example": "我们需要数据开发。",
      "examplePinyin": "Wǒmen xūyào shùjù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển dữ liệu."
    },
    {
      "word": "数据训练",
      "pinyin": "shùjù xùnliàn",
      "meaning": "huấn luyện dữ liệu",
      "example": "我们需要数据训练。",
      "examplePinyin": "Wǒmen xūyào shùjù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện dữ liệu."
    },
    {
      "word": "数据识别",
      "pinyin": "shùjù shíbié",
      "meaning": "nhận dạng dữ liệu",
      "example": "我们需要数据识别。",
      "examplePinyin": "Wǒmen xūyào shùjù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng dữ liệu."
    },
    {
      "word": "数据生成",
      "pinyin": "shùjù shēngchéng",
      "meaning": "tạo sinh dữ liệu",
      "example": "我们需要数据生成。",
      "examplePinyin": "Wǒmen xūyào shùjù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh dữ liệu."
    },
    {
      "word": "数据通知",
      "pinyin": "shùjù tōngzhī",
      "meaning": "thông báo dữ liệu",
      "example": "我们需要数据通知。",
      "examplePinyin": "Wǒmen xūyào shùjù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo dữ liệu."
    },
    {
      "word": "数据权限",
      "pinyin": "shùjù quánxiàn",
      "meaning": "quyền hạn dữ liệu",
      "example": "我们需要数据权限。",
      "examplePinyin": "Wǒmen xūyào shùjù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn dữ liệu."
    },
    {
      "word": "数据状态",
      "pinyin": "shùjù zhuàngtài",
      "meaning": "trạng thái dữ liệu",
      "example": "我们需要数据状态。",
      "examplePinyin": "Wǒmen xūyào shùjù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái dữ liệu."
    },
    {
      "word": "数据编号",
      "pinyin": "shùjù biānhào",
      "meaning": "mã số dữ liệu",
      "example": "我们需要数据编号。",
      "examplePinyin": "Wǒmen xūyào shùjù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số dữ liệu."
    },
    {
      "word": "数据模板",
      "pinyin": "shùjù múbǎn",
      "meaning": "mẫu/template dữ liệu",
      "example": "我们需要数据模板。",
      "examplePinyin": "Wǒmen xūyào shùjù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template dữ liệu."
    },
    {
      "word": "数据异常",
      "pinyin": "shùjù yìcháng",
      "meaning": "bất thường/lỗi dữ liệu",
      "example": "我们需要数据异常。",
      "examplePinyin": "Wǒmen xūyào shùjù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi dữ liệu."
    },
    {
      "word": "系统管理",
      "pinyin": "xìtǒng guǎnlǐ",
      "meaning": "quản lý hệ thống",
      "example": "我们需要系统管理。",
      "examplePinyin": "Wǒmen xūyào xìtǒng guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hệ thống."
    },
    {
      "word": "系统处理",
      "pinyin": "xìtǒng chǔlǐ",
      "meaning": "xử lý hệ thống",
      "example": "我们需要系统处理。",
      "examplePinyin": "Wǒmen xūyào xìtǒng chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hệ thống."
    },
    {
      "word": "系统分析",
      "pinyin": "xìtǒng fēnxī",
      "meaning": "phân tích hệ thống",
      "example": "我们需要系统分析。",
      "examplePinyin": "Wǒmen xūyào xìtǒng fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hệ thống."
    },
    {
      "word": "系统检查",
      "pinyin": "xìtǒng jiǎnchá",
      "meaning": "kiểm tra hệ thống",
      "example": "我们需要系统检查。",
      "examplePinyin": "Wǒmen xūyào xìtǒng jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hệ thống."
    },
    {
      "word": "系统记录",
      "pinyin": "xìtǒng jìlù",
      "meaning": "ghi chép hệ thống",
      "example": "我们需要系统记录。",
      "examplePinyin": "Wǒmen xūyào xìtǒng jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hệ thống."
    },
    {
      "word": "系统设置",
      "pinyin": "xìtǒng shèzhì",
      "meaning": "cài đặt hệ thống",
      "example": "我们需要系统设置。",
      "examplePinyin": "Wǒmen xūyào xìtǒng shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hệ thống."
    },
    {
      "word": "系统更新",
      "pinyin": "xìtǒng gēngxīn",
      "meaning": "cập nhật hệ thống",
      "example": "我们需要系统更新。",
      "examplePinyin": "Wǒmen xūyào xìtǒng gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hệ thống."
    },
    {
      "word": "系统优化",
      "pinyin": "xìtǒng yōuhuà",
      "meaning": "tối ưu hóa hệ thống",
      "example": "我们需要系统优化。",
      "examplePinyin": "Wǒmen xūyào xìtǒng yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hệ thống."
    },
    {
      "word": "系统导入",
      "pinyin": "xìtǒng dǎorù",
      "meaning": "nhập vào hệ thống",
      "example": "我们需要系统导入。",
      "examplePinyin": "Wǒmen xūyào xìtǒng dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hệ thống."
    },
    {
      "word": "系统导出",
      "pinyin": "xìtǒng dǎochū",
      "meaning": "xuất ra hệ thống",
      "example": "我们需要系统导出。",
      "examplePinyin": "Wǒmen xūyào xìtǒng dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hệ thống."
    },
    {
      "word": "系统备份",
      "pinyin": "xìtǒng bèifèn",
      "meaning": "sao lưu hệ thống",
      "example": "我们需要系统备份。",
      "examplePinyin": "Wǒmen xūyào xìtǒng bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu hệ thống."
    },
    {
      "word": "系统同步",
      "pinyin": "xìtǒng tóngbù",
      "meaning": "đồng bộ hệ thống",
      "example": "我们需要系统同步。",
      "examplePinyin": "Wǒmen xūyào xìtǒng tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ hệ thống."
    },
    {
      "word": "系统搜索",
      "pinyin": "xìtǒng sōusuǒ",
      "meaning": "tìm kiếm hệ thống",
      "example": "我们需要系统搜索。",
      "examplePinyin": "Wǒmen xūyào xìtǒng sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm hệ thống."
    },
    {
      "word": "系统分类",
      "pinyin": "xìtǒng fēnlèi",
      "meaning": "phân loại hệ thống",
      "example": "我们需要系统分类。",
      "examplePinyin": "Wǒmen xūyào xìtǒng fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại hệ thống."
    },
    {
      "word": "系统统计",
      "pinyin": "xìtǒng tǒngjì",
      "meaning": "thống kê hệ thống",
      "example": "我们需要系统统计。",
      "examplePinyin": "Wǒmen xūyào xìtǒng tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê hệ thống."
    },
    {
      "word": "系统确认",
      "pinyin": "xìtǒng quèrèn",
      "meaning": "xác nhận hệ thống",
      "example": "我们需要系统确认。",
      "examplePinyin": "Wǒmen xūyào xìtǒng quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận hệ thống."
    },
    {
      "word": "系统审核",
      "pinyin": "xìtǒng shěnhé",
      "meaning": "duyệt/kiểm duyệt hệ thống",
      "example": "我们需要系统审核。",
      "examplePinyin": "Wǒmen xūyào xìtǒng shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt hệ thống."
    },
    {
      "word": "系统测试",
      "pinyin": "xìtǒng cèshì",
      "meaning": "kiểm thử hệ thống",
      "example": "我们需要系统测试。",
      "examplePinyin": "Wǒmen xūyào xìtǒng cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử hệ thống."
    },
    {
      "word": "系统维护",
      "pinyin": "xìtǒng wéihù",
      "meaning": "bảo trì hệ thống",
      "example": "我们需要系统维护。",
      "examplePinyin": "Wǒmen xūyào xìtǒng wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì hệ thống."
    },
    {
      "word": "系统设计",
      "pinyin": "xìtǒng shèjì",
      "meaning": "thiết kế hệ thống",
      "example": "我们需要系统设计。",
      "examplePinyin": "Wǒmen xūyào xìtǒng shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế hệ thống."
    },
    {
      "word": "系统开发",
      "pinyin": "xìtǒng kāifā",
      "meaning": "phát triển hệ thống",
      "example": "我们需要系统开发。",
      "examplePinyin": "Wǒmen xūyào xìtǒng kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển hệ thống."
    },
    {
      "word": "系统训练",
      "pinyin": "xìtǒng xùnliàn",
      "meaning": "huấn luyện hệ thống",
      "example": "我们需要系统训练。",
      "examplePinyin": "Wǒmen xūyào xìtǒng xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện hệ thống."
    },
    {
      "word": "系统识别",
      "pinyin": "xìtǒng shíbié",
      "meaning": "nhận dạng hệ thống",
      "example": "我们需要系统识别。",
      "examplePinyin": "Wǒmen xūyào xìtǒng shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng hệ thống."
    },
    {
      "word": "系统生成",
      "pinyin": "xìtǒng shēngchéng",
      "meaning": "tạo sinh hệ thống",
      "example": "我们需要系统生成。",
      "examplePinyin": "Wǒmen xūyào xìtǒng shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh hệ thống."
    },
    {
      "word": "系统通知",
      "pinyin": "xìtǒng tōngzhī",
      "meaning": "thông báo hệ thống",
      "example": "我们需要系统通知。",
      "examplePinyin": "Wǒmen xūyào xìtǒng tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo hệ thống."
    },
    {
      "word": "系统权限",
      "pinyin": "xìtǒng quánxiàn",
      "meaning": "quyền hạn hệ thống",
      "example": "我们需要系统权限。",
      "examplePinyin": "Wǒmen xūyào xìtǒng quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn hệ thống."
    },
    {
      "word": "系统状态",
      "pinyin": "xìtǒng zhuàngtài",
      "meaning": "trạng thái hệ thống",
      "example": "我们需要系统状态。",
      "examplePinyin": "Wǒmen xūyào xìtǒng zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái hệ thống."
    },
    {
      "word": "系统编号",
      "pinyin": "xìtǒng biānhào",
      "meaning": "mã số hệ thống",
      "example": "我们需要系统编号。",
      "examplePinyin": "Wǒmen xūyào xìtǒng biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số hệ thống."
    },
    {
      "word": "系统模板",
      "pinyin": "xìtǒng múbǎn",
      "meaning": "mẫu/template hệ thống",
      "example": "我们需要系统模板。",
      "examplePinyin": "Wǒmen xūyào xìtǒng múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template hệ thống."
    },
    {
      "word": "系统异常",
      "pinyin": "xìtǒng yìcháng",
      "meaning": "bất thường/lỗi hệ thống",
      "example": "我们需要系统异常。",
      "examplePinyin": "Wǒmen xūyào xìtǒng yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi hệ thống."
    },
    {
      "word": "软件管理",
      "pinyin": "ruǎnjiàn guǎnlǐ",
      "meaning": "quản lý phần mềm",
      "example": "我们需要软件管理。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý phần mềm."
    },
    {
      "word": "软件处理",
      "pinyin": "ruǎnjiàn chǔlǐ",
      "meaning": "xử lý phần mềm",
      "example": "我们需要软件处理。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý phần mềm."
    },
    {
      "word": "软件分析",
      "pinyin": "ruǎnjiàn fēnxī",
      "meaning": "phân tích phần mềm",
      "example": "我们需要软件分析。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích phần mềm."
    },
    {
      "word": "软件检查",
      "pinyin": "ruǎnjiàn jiǎnchá",
      "meaning": "kiểm tra phần mềm",
      "example": "我们需要软件检查。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra phần mềm."
    },
    {
      "word": "软件记录",
      "pinyin": "ruǎnjiàn jìlù",
      "meaning": "ghi chép phần mềm",
      "example": "我们需要软件记录。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép phần mềm."
    },
    {
      "word": "软件设置",
      "pinyin": "ruǎnjiàn shèzhì",
      "meaning": "cài đặt phần mềm",
      "example": "我们需要软件设置。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt phần mềm."
    },
    {
      "word": "软件更新",
      "pinyin": "ruǎnjiàn gēngxīn",
      "meaning": "cập nhật phần mềm",
      "example": "我们需要软件更新。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật phần mềm."
    },
    {
      "word": "软件优化",
      "pinyin": "ruǎnjiàn yōuhuà",
      "meaning": "tối ưu hóa phần mềm",
      "example": "我们需要软件优化。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa phần mềm."
    },
    {
      "word": "软件导入",
      "pinyin": "ruǎnjiàn dǎorù",
      "meaning": "nhập vào phần mềm",
      "example": "我们需要软件导入。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào phần mềm."
    },
    {
      "word": "软件导出",
      "pinyin": "ruǎnjiàn dǎochū",
      "meaning": "xuất ra phần mềm",
      "example": "我们需要软件导出。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra phần mềm."
    },
    {
      "word": "软件备份",
      "pinyin": "ruǎnjiàn bèifèn",
      "meaning": "sao lưu phần mềm",
      "example": "我们需要软件备份。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu phần mềm."
    },
    {
      "word": "软件同步",
      "pinyin": "ruǎnjiàn tóngbù",
      "meaning": "đồng bộ phần mềm",
      "example": "我们需要软件同步。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ phần mềm."
    },
    {
      "word": "软件搜索",
      "pinyin": "ruǎnjiàn sōusuǒ",
      "meaning": "tìm kiếm phần mềm",
      "example": "我们需要软件搜索。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm phần mềm."
    },
    {
      "word": "软件分类",
      "pinyin": "ruǎnjiàn fēnlèi",
      "meaning": "phân loại phần mềm",
      "example": "我们需要软件分类。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại phần mềm."
    },
    {
      "word": "软件统计",
      "pinyin": "ruǎnjiàn tǒngjì",
      "meaning": "thống kê phần mềm",
      "example": "我们需要软件统计。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê phần mềm."
    },
    {
      "word": "软件确认",
      "pinyin": "ruǎnjiàn quèrèn",
      "meaning": "xác nhận phần mềm",
      "example": "我们需要软件确认。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận phần mềm."
    },
    {
      "word": "软件审核",
      "pinyin": "ruǎnjiàn shěnhé",
      "meaning": "duyệt/kiểm duyệt phần mềm",
      "example": "我们需要软件审核。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt phần mềm."
    },
    {
      "word": "软件测试",
      "pinyin": "ruǎnjiàn cèshì",
      "meaning": "kiểm thử phần mềm",
      "example": "我们需要软件测试。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử phần mềm."
    },
    {
      "word": "软件维护",
      "pinyin": "ruǎnjiàn wéihù",
      "meaning": "bảo trì phần mềm",
      "example": "我们需要软件维护。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì phần mềm."
    },
    {
      "word": "软件设计",
      "pinyin": "ruǎnjiàn shèjì",
      "meaning": "thiết kế phần mềm",
      "example": "我们需要软件设计。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế phần mềm."
    },
    {
      "word": "软件开发",
      "pinyin": "ruǎnjiàn kāifā",
      "meaning": "phát triển phần mềm",
      "example": "我们需要软件开发。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển phần mềm."
    },
    {
      "word": "软件训练",
      "pinyin": "ruǎnjiàn xùnliàn",
      "meaning": "huấn luyện phần mềm",
      "example": "我们需要软件训练。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện phần mềm."
    },
    {
      "word": "软件识别",
      "pinyin": "ruǎnjiàn shíbié",
      "meaning": "nhận dạng phần mềm",
      "example": "我们需要软件识别。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng phần mềm."
    },
    {
      "word": "软件生成",
      "pinyin": "ruǎnjiàn shēngchéng",
      "meaning": "tạo sinh phần mềm",
      "example": "我们需要软件生成。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh phần mềm."
    },
    {
      "word": "软件通知",
      "pinyin": "ruǎnjiàn tōngzhī",
      "meaning": "thông báo phần mềm",
      "example": "我们需要软件通知。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo phần mềm."
    },
    {
      "word": "软件权限",
      "pinyin": "ruǎnjiàn quánxiàn",
      "meaning": "quyền hạn phần mềm",
      "example": "我们需要软件权限。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn phần mềm."
    },
    {
      "word": "软件状态",
      "pinyin": "ruǎnjiàn zhuàngtài",
      "meaning": "trạng thái phần mềm",
      "example": "我们需要软件状态。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái phần mềm."
    },
    {
      "word": "软件编号",
      "pinyin": "ruǎnjiàn biānhào",
      "meaning": "mã số phần mềm",
      "example": "我们需要软件编号。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số phần mềm."
    },
    {
      "word": "软件模板",
      "pinyin": "ruǎnjiàn múbǎn",
      "meaning": "mẫu/template phần mềm",
      "example": "我们需要软件模板。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template phần mềm."
    },
    {
      "word": "软件异常",
      "pinyin": "ruǎnjiàn yìcháng",
      "meaning": "bất thường/lỗi phần mềm",
      "example": "我们需要软件异常。",
      "examplePinyin": "Wǒmen xūyào ruǎnjiàn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi phần mềm."
    },
    {
      "word": "硬件管理",
      "pinyin": "yìngjiàn guǎnlǐ",
      "meaning": "quản lý phần cứng",
      "example": "我们需要硬件管理。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý phần cứng."
    },
    {
      "word": "硬件处理",
      "pinyin": "yìngjiàn chǔlǐ",
      "meaning": "xử lý phần cứng",
      "example": "我们需要硬件处理。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý phần cứng."
    },
    {
      "word": "硬件分析",
      "pinyin": "yìngjiàn fēnxī",
      "meaning": "phân tích phần cứng",
      "example": "我们需要硬件分析。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích phần cứng."
    },
    {
      "word": "硬件检查",
      "pinyin": "yìngjiàn jiǎnchá",
      "meaning": "kiểm tra phần cứng",
      "example": "我们需要硬件检查。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra phần cứng."
    },
    {
      "word": "硬件记录",
      "pinyin": "yìngjiàn jìlù",
      "meaning": "ghi chép phần cứng",
      "example": "我们需要硬件记录。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép phần cứng."
    },
    {
      "word": "硬件设置",
      "pinyin": "yìngjiàn shèzhì",
      "meaning": "cài đặt phần cứng",
      "example": "我们需要硬件设置。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt phần cứng."
    },
    {
      "word": "硬件更新",
      "pinyin": "yìngjiàn gēngxīn",
      "meaning": "cập nhật phần cứng",
      "example": "我们需要硬件更新。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật phần cứng."
    },
    {
      "word": "硬件优化",
      "pinyin": "yìngjiàn yōuhuà",
      "meaning": "tối ưu hóa phần cứng",
      "example": "我们需要硬件优化。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa phần cứng."
    },
    {
      "word": "硬件导入",
      "pinyin": "yìngjiàn dǎorù",
      "meaning": "nhập vào phần cứng",
      "example": "我们需要硬件导入。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào phần cứng."
    },
    {
      "word": "硬件导出",
      "pinyin": "yìngjiàn dǎochū",
      "meaning": "xuất ra phần cứng",
      "example": "我们需要硬件导出。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra phần cứng."
    },
    {
      "word": "硬件备份",
      "pinyin": "yìngjiàn bèifèn",
      "meaning": "sao lưu phần cứng",
      "example": "我们需要硬件备份。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu phần cứng."
    },
    {
      "word": "硬件同步",
      "pinyin": "yìngjiàn tóngbù",
      "meaning": "đồng bộ phần cứng",
      "example": "我们需要硬件同步。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ phần cứng."
    },
    {
      "word": "硬件搜索",
      "pinyin": "yìngjiàn sōusuǒ",
      "meaning": "tìm kiếm phần cứng",
      "example": "我们需要硬件搜索。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm phần cứng."
    },
    {
      "word": "硬件分类",
      "pinyin": "yìngjiàn fēnlèi",
      "meaning": "phân loại phần cứng",
      "example": "我们需要硬件分类。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại phần cứng."
    },
    {
      "word": "硬件统计",
      "pinyin": "yìngjiàn tǒngjì",
      "meaning": "thống kê phần cứng",
      "example": "我们需要硬件统计。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê phần cứng."
    },
    {
      "word": "硬件确认",
      "pinyin": "yìngjiàn quèrèn",
      "meaning": "xác nhận phần cứng",
      "example": "我们需要硬件确认。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận phần cứng."
    },
    {
      "word": "硬件审核",
      "pinyin": "yìngjiàn shěnhé",
      "meaning": "duyệt/kiểm duyệt phần cứng",
      "example": "我们需要硬件审核。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt phần cứng."
    },
    {
      "word": "硬件测试",
      "pinyin": "yìngjiàn cèshì",
      "meaning": "kiểm thử phần cứng",
      "example": "我们需要硬件测试。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử phần cứng."
    },
    {
      "word": "硬件维护",
      "pinyin": "yìngjiàn wéihù",
      "meaning": "bảo trì phần cứng",
      "example": "我们需要硬件维护。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì phần cứng."
    },
    {
      "word": "硬件设计",
      "pinyin": "yìngjiàn shèjì",
      "meaning": "thiết kế phần cứng",
      "example": "我们需要硬件设计。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế phần cứng."
    },
    {
      "word": "硬件开发",
      "pinyin": "yìngjiàn kāifā",
      "meaning": "phát triển phần cứng",
      "example": "我们需要硬件开发。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển phần cứng."
    },
    {
      "word": "硬件训练",
      "pinyin": "yìngjiàn xùnliàn",
      "meaning": "huấn luyện phần cứng",
      "example": "我们需要硬件训练。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện phần cứng."
    },
    {
      "word": "硬件识别",
      "pinyin": "yìngjiàn shíbié",
      "meaning": "nhận dạng phần cứng",
      "example": "我们需要硬件识别。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng phần cứng."
    },
    {
      "word": "硬件生成",
      "pinyin": "yìngjiàn shēngchéng",
      "meaning": "tạo sinh phần cứng",
      "example": "我们需要硬件生成。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh phần cứng."
    },
    {
      "word": "硬件通知",
      "pinyin": "yìngjiàn tōngzhī",
      "meaning": "thông báo phần cứng",
      "example": "我们需要硬件通知。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo phần cứng."
    },
    {
      "word": "硬件权限",
      "pinyin": "yìngjiàn quánxiàn",
      "meaning": "quyền hạn phần cứng",
      "example": "我们需要硬件权限。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn phần cứng."
    },
    {
      "word": "硬件状态",
      "pinyin": "yìngjiàn zhuàngtài",
      "meaning": "trạng thái phần cứng",
      "example": "我们需要硬件状态。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái phần cứng."
    },
    {
      "word": "硬件编号",
      "pinyin": "yìngjiàn biānhào",
      "meaning": "mã số phần cứng",
      "example": "我们需要硬件编号。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số phần cứng."
    },
    {
      "word": "硬件模板",
      "pinyin": "yìngjiàn múbǎn",
      "meaning": "mẫu/template phần cứng",
      "example": "我们需要硬件模板。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template phần cứng."
    },
    {
      "word": "硬件异常",
      "pinyin": "yìngjiàn yìcháng",
      "meaning": "bất thường/lỗi phần cứng",
      "example": "我们需要硬件异常。",
      "examplePinyin": "Wǒmen xūyào yìngjiàn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi phần cứng."
    },
    {
      "word": "代码管理",
      "pinyin": "dàimǎ guǎnlǐ",
      "meaning": "quản lý mã code",
      "example": "我们需要代码管理。",
      "examplePinyin": "Wǒmen xūyào dàimǎ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý mã code."
    },
    {
      "word": "代码处理",
      "pinyin": "dàimǎ chǔlǐ",
      "meaning": "xử lý mã code",
      "example": "我们需要代码处理。",
      "examplePinyin": "Wǒmen xūyào dàimǎ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý mã code."
    },
    {
      "word": "代码分析",
      "pinyin": "dàimǎ fēnxī",
      "meaning": "phân tích mã code",
      "example": "我们需要代码分析。",
      "examplePinyin": "Wǒmen xūyào dàimǎ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích mã code."
    },
    {
      "word": "代码检查",
      "pinyin": "dàimǎ jiǎnchá",
      "meaning": "kiểm tra mã code",
      "example": "我们需要代码检查。",
      "examplePinyin": "Wǒmen xūyào dàimǎ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra mã code."
    },
    {
      "word": "代码记录",
      "pinyin": "dàimǎ jìlù",
      "meaning": "ghi chép mã code",
      "example": "我们需要代码记录。",
      "examplePinyin": "Wǒmen xūyào dàimǎ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép mã code."
    },
    {
      "word": "代码设置",
      "pinyin": "dàimǎ shèzhì",
      "meaning": "cài đặt mã code",
      "example": "我们需要代码设置。",
      "examplePinyin": "Wǒmen xūyào dàimǎ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt mã code."
    },
    {
      "word": "代码更新",
      "pinyin": "dàimǎ gēngxīn",
      "meaning": "cập nhật mã code",
      "example": "我们需要代码更新。",
      "examplePinyin": "Wǒmen xūyào dàimǎ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật mã code."
    },
    {
      "word": "代码优化",
      "pinyin": "dàimǎ yōuhuà",
      "meaning": "tối ưu hóa mã code",
      "example": "我们需要代码优化。",
      "examplePinyin": "Wǒmen xūyào dàimǎ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa mã code."
    },
    {
      "word": "代码导入",
      "pinyin": "dàimǎ dǎorù",
      "meaning": "nhập vào mã code",
      "example": "我们需要代码导入。",
      "examplePinyin": "Wǒmen xūyào dàimǎ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào mã code."
    },
    {
      "word": "代码导出",
      "pinyin": "dàimǎ dǎochū",
      "meaning": "xuất ra mã code",
      "example": "我们需要代码导出。",
      "examplePinyin": "Wǒmen xūyào dàimǎ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra mã code."
    },
    {
      "word": "代码备份",
      "pinyin": "dàimǎ bèifèn",
      "meaning": "sao lưu mã code",
      "example": "我们需要代码备份。",
      "examplePinyin": "Wǒmen xūyào dàimǎ bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu mã code."
    },
    {
      "word": "代码同步",
      "pinyin": "dàimǎ tóngbù",
      "meaning": "đồng bộ mã code",
      "example": "我们需要代码同步。",
      "examplePinyin": "Wǒmen xūyào dàimǎ tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ mã code."
    },
    {
      "word": "代码搜索",
      "pinyin": "dàimǎ sōusuǒ",
      "meaning": "tìm kiếm mã code",
      "example": "我们需要代码搜索。",
      "examplePinyin": "Wǒmen xūyào dàimǎ sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm mã code."
    },
    {
      "word": "代码分类",
      "pinyin": "dàimǎ fēnlèi",
      "meaning": "phân loại mã code",
      "example": "我们需要代码分类。",
      "examplePinyin": "Wǒmen xūyào dàimǎ fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại mã code."
    },
    {
      "word": "代码统计",
      "pinyin": "dàimǎ tǒngjì",
      "meaning": "thống kê mã code",
      "example": "我们需要代码统计。",
      "examplePinyin": "Wǒmen xūyào dàimǎ tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê mã code."
    },
    {
      "word": "代码确认",
      "pinyin": "dàimǎ quèrèn",
      "meaning": "xác nhận mã code",
      "example": "我们需要代码确认。",
      "examplePinyin": "Wǒmen xūyào dàimǎ quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận mã code."
    },
    {
      "word": "代码审核",
      "pinyin": "dàimǎ shěnhé",
      "meaning": "duyệt/kiểm duyệt mã code",
      "example": "我们需要代码审核。",
      "examplePinyin": "Wǒmen xūyào dàimǎ shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt mã code."
    },
    {
      "word": "代码测试",
      "pinyin": "dàimǎ cèshì",
      "meaning": "kiểm thử mã code",
      "example": "我们需要代码测试。",
      "examplePinyin": "Wǒmen xūyào dàimǎ cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử mã code."
    },
    {
      "word": "代码维护",
      "pinyin": "dàimǎ wéihù",
      "meaning": "bảo trì mã code",
      "example": "我们需要代码维护。",
      "examplePinyin": "Wǒmen xūyào dàimǎ wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì mã code."
    },
    {
      "word": "代码设计",
      "pinyin": "dàimǎ shèjì",
      "meaning": "thiết kế mã code",
      "example": "我们需要代码设计。",
      "examplePinyin": "Wǒmen xūyào dàimǎ shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế mã code."
    },
    {
      "word": "代码开发",
      "pinyin": "dàimǎ kāifā",
      "meaning": "phát triển mã code",
      "example": "我们需要代码开发。",
      "examplePinyin": "Wǒmen xūyào dàimǎ kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển mã code."
    },
    {
      "word": "代码训练",
      "pinyin": "dàimǎ xùnliàn",
      "meaning": "huấn luyện mã code",
      "example": "我们需要代码训练。",
      "examplePinyin": "Wǒmen xūyào dàimǎ xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện mã code."
    },
    {
      "word": "代码识别",
      "pinyin": "dàimǎ shíbié",
      "meaning": "nhận dạng mã code",
      "example": "我们需要代码识别。",
      "examplePinyin": "Wǒmen xūyào dàimǎ shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng mã code."
    },
    {
      "word": "代码生成",
      "pinyin": "dàimǎ shēngchéng",
      "meaning": "tạo sinh mã code",
      "example": "我们需要代码生成。",
      "examplePinyin": "Wǒmen xūyào dàimǎ shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh mã code."
    },
    {
      "word": "代码通知",
      "pinyin": "dàimǎ tōngzhī",
      "meaning": "thông báo mã code",
      "example": "我们需要代码通知。",
      "examplePinyin": "Wǒmen xūyào dàimǎ tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo mã code."
    },
    {
      "word": "代码权限",
      "pinyin": "dàimǎ quánxiàn",
      "meaning": "quyền hạn mã code",
      "example": "我们需要代码权限。",
      "examplePinyin": "Wǒmen xūyào dàimǎ quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn mã code."
    },
    {
      "word": "代码状态",
      "pinyin": "dàimǎ zhuàngtài",
      "meaning": "trạng thái mã code",
      "example": "我们需要代码状态。",
      "examplePinyin": "Wǒmen xūyào dàimǎ zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái mã code."
    },
    {
      "word": "代码编号",
      "pinyin": "dàimǎ biānhào",
      "meaning": "mã số mã code",
      "example": "我们需要代码编号。",
      "examplePinyin": "Wǒmen xūyào dàimǎ biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số mã code."
    },
    {
      "word": "代码模板",
      "pinyin": "dàimǎ múbǎn",
      "meaning": "mẫu/template mã code",
      "example": "我们需要代码模板。",
      "examplePinyin": "Wǒmen xūyào dàimǎ múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template mã code."
    },
    {
      "word": "代码异常",
      "pinyin": "dàimǎ yìcháng",
      "meaning": "bất thường/lỗi mã code",
      "example": "我们需要代码异常。",
      "examplePinyin": "Wǒmen xūyào dàimǎ yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi mã code."
    },
    {
      "word": "网页管理",
      "pinyin": "wǎngyè guǎnlǐ",
      "meaning": "quản lý trang web",
      "example": "我们需要网页管理。",
      "examplePinyin": "Wǒmen xūyào wǎngyè guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý trang web."
    },
    {
      "word": "网页处理",
      "pinyin": "wǎngyè chǔlǐ",
      "meaning": "xử lý trang web",
      "example": "我们需要网页处理。",
      "examplePinyin": "Wǒmen xūyào wǎngyè chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý trang web."
    },
    {
      "word": "网页分析",
      "pinyin": "wǎngyè fēnxī",
      "meaning": "phân tích trang web",
      "example": "我们需要网页分析。",
      "examplePinyin": "Wǒmen xūyào wǎngyè fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích trang web."
    },
    {
      "word": "网页检查",
      "pinyin": "wǎngyè jiǎnchá",
      "meaning": "kiểm tra trang web",
      "example": "我们需要网页检查。",
      "examplePinyin": "Wǒmen xūyào wǎngyè jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra trang web."
    },
    {
      "word": "网页记录",
      "pinyin": "wǎngyè jìlù",
      "meaning": "ghi chép trang web",
      "example": "我们需要网页记录。",
      "examplePinyin": "Wǒmen xūyào wǎngyè jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép trang web."
    },
    {
      "word": "网页设置",
      "pinyin": "wǎngyè shèzhì",
      "meaning": "cài đặt trang web",
      "example": "我们需要网页设置。",
      "examplePinyin": "Wǒmen xūyào wǎngyè shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt trang web."
    },
    {
      "word": "网页更新",
      "pinyin": "wǎngyè gēngxīn",
      "meaning": "cập nhật trang web",
      "example": "我们需要网页更新。",
      "examplePinyin": "Wǒmen xūyào wǎngyè gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật trang web."
    },
    {
      "word": "网页优化",
      "pinyin": "wǎngyè yōuhuà",
      "meaning": "tối ưu hóa trang web",
      "example": "我们需要网页优化。",
      "examplePinyin": "Wǒmen xūyào wǎngyè yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa trang web."
    },
    {
      "word": "网页导入",
      "pinyin": "wǎngyè dǎorù",
      "meaning": "nhập vào trang web",
      "example": "我们需要网页导入。",
      "examplePinyin": "Wǒmen xūyào wǎngyè dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào trang web."
    },
    {
      "word": "网页导出",
      "pinyin": "wǎngyè dǎochū",
      "meaning": "xuất ra trang web",
      "example": "我们需要网页导出。",
      "examplePinyin": "Wǒmen xūyào wǎngyè dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra trang web."
    },
    {
      "word": "网页备份",
      "pinyin": "wǎngyè bèifèn",
      "meaning": "sao lưu trang web",
      "example": "我们需要网页备份。",
      "examplePinyin": "Wǒmen xūyào wǎngyè bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu trang web."
    },
    {
      "word": "网页同步",
      "pinyin": "wǎngyè tóngbù",
      "meaning": "đồng bộ trang web",
      "example": "我们需要网页同步。",
      "examplePinyin": "Wǒmen xūyào wǎngyè tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ trang web."
    },
    {
      "word": "网页搜索",
      "pinyin": "wǎngyè sōusuǒ",
      "meaning": "tìm kiếm trang web",
      "example": "我们需要网页搜索。",
      "examplePinyin": "Wǒmen xūyào wǎngyè sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm trang web."
    },
    {
      "word": "网页分类",
      "pinyin": "wǎngyè fēnlèi",
      "meaning": "phân loại trang web",
      "example": "我们需要网页分类。",
      "examplePinyin": "Wǒmen xūyào wǎngyè fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại trang web."
    },
    {
      "word": "网页统计",
      "pinyin": "wǎngyè tǒngjì",
      "meaning": "thống kê trang web",
      "example": "我们需要网页统计。",
      "examplePinyin": "Wǒmen xūyào wǎngyè tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê trang web."
    },
    {
      "word": "网页确认",
      "pinyin": "wǎngyè quèrèn",
      "meaning": "xác nhận trang web",
      "example": "我们需要网页确认。",
      "examplePinyin": "Wǒmen xūyào wǎngyè quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận trang web."
    },
    {
      "word": "网页审核",
      "pinyin": "wǎngyè shěnhé",
      "meaning": "duyệt/kiểm duyệt trang web",
      "example": "我们需要网页审核。",
      "examplePinyin": "Wǒmen xūyào wǎngyè shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt trang web."
    },
    {
      "word": "网页测试",
      "pinyin": "wǎngyè cèshì",
      "meaning": "kiểm thử trang web",
      "example": "我们需要网页测试。",
      "examplePinyin": "Wǒmen xūyào wǎngyè cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử trang web."
    },
    {
      "word": "网页维护",
      "pinyin": "wǎngyè wéihù",
      "meaning": "bảo trì trang web",
      "example": "我们需要网页维护。",
      "examplePinyin": "Wǒmen xūyào wǎngyè wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì trang web."
    },
    {
      "word": "网页设计",
      "pinyin": "wǎngyè shèjì",
      "meaning": "thiết kế trang web",
      "example": "我们需要网页设计。",
      "examplePinyin": "Wǒmen xūyào wǎngyè shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế trang web."
    },
    {
      "word": "网页开发",
      "pinyin": "wǎngyè kāifā",
      "meaning": "phát triển trang web",
      "example": "我们需要网页开发。",
      "examplePinyin": "Wǒmen xūyào wǎngyè kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển trang web."
    },
    {
      "word": "网页训练",
      "pinyin": "wǎngyè xùnliàn",
      "meaning": "huấn luyện trang web",
      "example": "我们需要网页训练。",
      "examplePinyin": "Wǒmen xūyào wǎngyè xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện trang web."
    },
    {
      "word": "网页识别",
      "pinyin": "wǎngyè shíbié",
      "meaning": "nhận dạng trang web",
      "example": "我们需要网页识别。",
      "examplePinyin": "Wǒmen xūyào wǎngyè shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng trang web."
    },
    {
      "word": "网页生成",
      "pinyin": "wǎngyè shēngchéng",
      "meaning": "tạo sinh trang web",
      "example": "我们需要网页生成。",
      "examplePinyin": "Wǒmen xūyào wǎngyè shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh trang web."
    },
    {
      "word": "网页通知",
      "pinyin": "wǎngyè tōngzhī",
      "meaning": "thông báo trang web",
      "example": "我们需要网页通知。",
      "examplePinyin": "Wǒmen xūyào wǎngyè tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo trang web."
    },
    {
      "word": "网页权限",
      "pinyin": "wǎngyè quánxiàn",
      "meaning": "quyền hạn trang web",
      "example": "我们需要网页权限。",
      "examplePinyin": "Wǒmen xūyào wǎngyè quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn trang web."
    },
    {
      "word": "网页状态",
      "pinyin": "wǎngyè zhuàngtài",
      "meaning": "trạng thái trang web",
      "example": "我们需要网页状态。",
      "examplePinyin": "Wǒmen xūyào wǎngyè zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái trang web."
    },
    {
      "word": "网页编号",
      "pinyin": "wǎngyè biānhào",
      "meaning": "mã số trang web",
      "example": "我们需要网页编号。",
      "examplePinyin": "Wǒmen xūyào wǎngyè biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số trang web."
    },
    {
      "word": "网页模板",
      "pinyin": "wǎngyè múbǎn",
      "meaning": "mẫu/template trang web",
      "example": "我们需要网页模板。",
      "examplePinyin": "Wǒmen xūyào wǎngyè múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template trang web."
    },
    {
      "word": "网页异常",
      "pinyin": "wǎngyè yìcháng",
      "meaning": "bất thường/lỗi trang web",
      "example": "我们需要网页异常。",
      "examplePinyin": "Wǒmen xūyào wǎngyè yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi trang web."
    },
    {
      "word": "服务器管理",
      "pinyin": "fúwùqì guǎnlǐ",
      "meaning": "quản lý máy chủ",
      "example": "我们需要服务器管理。",
      "examplePinyin": "Wǒmen xūyào fúwùqì guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý máy chủ."
    },
    {
      "word": "服务器处理",
      "pinyin": "fúwùqì chǔlǐ",
      "meaning": "xử lý máy chủ",
      "example": "我们需要服务器处理。",
      "examplePinyin": "Wǒmen xūyào fúwùqì chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý máy chủ."
    },
    {
      "word": "服务器分析",
      "pinyin": "fúwùqì fēnxī",
      "meaning": "phân tích máy chủ",
      "example": "我们需要服务器分析。",
      "examplePinyin": "Wǒmen xūyào fúwùqì fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích máy chủ."
    },
    {
      "word": "服务器检查",
      "pinyin": "fúwùqì jiǎnchá",
      "meaning": "kiểm tra máy chủ",
      "example": "我们需要服务器检查。",
      "examplePinyin": "Wǒmen xūyào fúwùqì jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra máy chủ."
    },
    {
      "word": "服务器记录",
      "pinyin": "fúwùqì jìlù",
      "meaning": "ghi chép máy chủ",
      "example": "我们需要服务器记录。",
      "examplePinyin": "Wǒmen xūyào fúwùqì jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép máy chủ."
    },
    {
      "word": "服务器设置",
      "pinyin": "fúwùqì shèzhì",
      "meaning": "cài đặt máy chủ",
      "example": "我们需要服务器设置。",
      "examplePinyin": "Wǒmen xūyào fúwùqì shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt máy chủ."
    },
    {
      "word": "服务器更新",
      "pinyin": "fúwùqì gēngxīn",
      "meaning": "cập nhật máy chủ",
      "example": "我们需要服务器更新。",
      "examplePinyin": "Wǒmen xūyào fúwùqì gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật máy chủ."
    },
    {
      "word": "服务器优化",
      "pinyin": "fúwùqì yōuhuà",
      "meaning": "tối ưu hóa máy chủ",
      "example": "我们需要服务器优化。",
      "examplePinyin": "Wǒmen xūyào fúwùqì yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa máy chủ."
    },
    {
      "word": "服务器导入",
      "pinyin": "fúwùqì dǎorù",
      "meaning": "nhập vào máy chủ",
      "example": "我们需要服务器导入。",
      "examplePinyin": "Wǒmen xūyào fúwùqì dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào máy chủ."
    },
    {
      "word": "服务器导出",
      "pinyin": "fúwùqì dǎochū",
      "meaning": "xuất ra máy chủ",
      "example": "我们需要服务器导出。",
      "examplePinyin": "Wǒmen xūyào fúwùqì dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra máy chủ."
    },
    {
      "word": "服务器备份",
      "pinyin": "fúwùqì bèifèn",
      "meaning": "sao lưu máy chủ",
      "example": "我们需要服务器备份。",
      "examplePinyin": "Wǒmen xūyào fúwùqì bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu máy chủ."
    },
    {
      "word": "服务器同步",
      "pinyin": "fúwùqì tóngbù",
      "meaning": "đồng bộ máy chủ",
      "example": "我们需要服务器同步。",
      "examplePinyin": "Wǒmen xūyào fúwùqì tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ máy chủ."
    },
    {
      "word": "服务器搜索",
      "pinyin": "fúwùqì sōusuǒ",
      "meaning": "tìm kiếm máy chủ",
      "example": "我们需要服务器搜索。",
      "examplePinyin": "Wǒmen xūyào fúwùqì sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm máy chủ."
    },
    {
      "word": "服务器分类",
      "pinyin": "fúwùqì fēnlèi",
      "meaning": "phân loại máy chủ",
      "example": "我们需要服务器分类。",
      "examplePinyin": "Wǒmen xūyào fúwùqì fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại máy chủ."
    },
    {
      "word": "服务器统计",
      "pinyin": "fúwùqì tǒngjì",
      "meaning": "thống kê máy chủ",
      "example": "我们需要服务器统计。",
      "examplePinyin": "Wǒmen xūyào fúwùqì tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê máy chủ."
    },
    {
      "word": "服务器确认",
      "pinyin": "fúwùqì quèrèn",
      "meaning": "xác nhận máy chủ",
      "example": "我们需要服务器确认。",
      "examplePinyin": "Wǒmen xūyào fúwùqì quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận máy chủ."
    },
    {
      "word": "服务器审核",
      "pinyin": "fúwùqì shěnhé",
      "meaning": "duyệt/kiểm duyệt máy chủ",
      "example": "我们需要服务器审核。",
      "examplePinyin": "Wǒmen xūyào fúwùqì shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt máy chủ."
    },
    {
      "word": "服务器测试",
      "pinyin": "fúwùqì cèshì",
      "meaning": "kiểm thử máy chủ",
      "example": "我们需要服务器测试。",
      "examplePinyin": "Wǒmen xūyào fúwùqì cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử máy chủ."
    },
    {
      "word": "服务器维护",
      "pinyin": "fúwùqì wéihù",
      "meaning": "bảo trì máy chủ",
      "example": "我们需要服务器维护。",
      "examplePinyin": "Wǒmen xūyào fúwùqì wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì máy chủ."
    },
    {
      "word": "服务器设计",
      "pinyin": "fúwùqì shèjì",
      "meaning": "thiết kế máy chủ",
      "example": "我们需要服务器设计。",
      "examplePinyin": "Wǒmen xūyào fúwùqì shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế máy chủ."
    },
    {
      "word": "服务器开发",
      "pinyin": "fúwùqì kāifā",
      "meaning": "phát triển máy chủ",
      "example": "我们需要服务器开发。",
      "examplePinyin": "Wǒmen xūyào fúwùqì kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển máy chủ."
    },
    {
      "word": "服务器训练",
      "pinyin": "fúwùqì xùnliàn",
      "meaning": "huấn luyện máy chủ",
      "example": "我们需要服务器训练。",
      "examplePinyin": "Wǒmen xūyào fúwùqì xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện máy chủ."
    },
    {
      "word": "服务器识别",
      "pinyin": "fúwùqì shíbié",
      "meaning": "nhận dạng máy chủ",
      "example": "我们需要服务器识别。",
      "examplePinyin": "Wǒmen xūyào fúwùqì shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng máy chủ."
    },
    {
      "word": "服务器生成",
      "pinyin": "fúwùqì shēngchéng",
      "meaning": "tạo sinh máy chủ",
      "example": "我们需要服务器生成。",
      "examplePinyin": "Wǒmen xūyào fúwùqì shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh máy chủ."
    },
    {
      "word": "服务器通知",
      "pinyin": "fúwùqì tōngzhī",
      "meaning": "thông báo máy chủ",
      "example": "我们需要服务器通知。",
      "examplePinyin": "Wǒmen xūyào fúwùqì tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo máy chủ."
    },
    {
      "word": "服务器权限",
      "pinyin": "fúwùqì quánxiàn",
      "meaning": "quyền hạn máy chủ",
      "example": "我们需要服务器权限。",
      "examplePinyin": "Wǒmen xūyào fúwùqì quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn máy chủ."
    },
    {
      "word": "服务器状态",
      "pinyin": "fúwùqì zhuàngtài",
      "meaning": "trạng thái máy chủ",
      "example": "我们需要服务器状态。",
      "examplePinyin": "Wǒmen xūyào fúwùqì zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái máy chủ."
    },
    {
      "word": "服务器编号",
      "pinyin": "fúwùqì biānhào",
      "meaning": "mã số máy chủ",
      "example": "我们需要服务器编号。",
      "examplePinyin": "Wǒmen xūyào fúwùqì biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số máy chủ."
    },
    {
      "word": "服务器模板",
      "pinyin": "fúwùqì múbǎn",
      "meaning": "mẫu/template máy chủ",
      "example": "我们需要服务器模板。",
      "examplePinyin": "Wǒmen xūyào fúwùqì múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template máy chủ."
    },
    {
      "word": "服务器异常",
      "pinyin": "fúwùqì yìcháng",
      "meaning": "bất thường/lỗi máy chủ",
      "example": "我们需要服务器异常。",
      "examplePinyin": "Wǒmen xūyào fúwùqì yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi máy chủ."
    },
    {
      "word": "数据库管理",
      "pinyin": "shùjùkù guǎnlǐ",
      "meaning": "quản lý cơ sở dữ liệu",
      "example": "我们需要数据库管理。",
      "examplePinyin": "Wǒmen xūyào shùjùkù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý cơ sở dữ liệu."
    },
    {
      "word": "数据库处理",
      "pinyin": "shùjùkù chǔlǐ",
      "meaning": "xử lý cơ sở dữ liệu",
      "example": "我们需要数据库处理。",
      "examplePinyin": "Wǒmen xūyào shùjùkù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý cơ sở dữ liệu."
    },
    {
      "word": "数据库分析",
      "pinyin": "shùjùkù fēnxī",
      "meaning": "phân tích cơ sở dữ liệu",
      "example": "我们需要数据库分析。",
      "examplePinyin": "Wǒmen xūyào shùjùkù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích cơ sở dữ liệu."
    },
    {
      "word": "数据库检查",
      "pinyin": "shùjùkù jiǎnchá",
      "meaning": "kiểm tra cơ sở dữ liệu",
      "example": "我们需要数据库检查。",
      "examplePinyin": "Wǒmen xūyào shùjùkù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra cơ sở dữ liệu."
    },
    {
      "word": "数据库记录",
      "pinyin": "shùjùkù jìlù",
      "meaning": "ghi chép cơ sở dữ liệu",
      "example": "我们需要数据库记录。",
      "examplePinyin": "Wǒmen xūyào shùjùkù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép cơ sở dữ liệu."
    },
    {
      "word": "数据库设置",
      "pinyin": "shùjùkù shèzhì",
      "meaning": "cài đặt cơ sở dữ liệu",
      "example": "我们需要数据库设置。",
      "examplePinyin": "Wǒmen xūyào shùjùkù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt cơ sở dữ liệu."
    },
    {
      "word": "数据库更新",
      "pinyin": "shùjùkù gēngxīn",
      "meaning": "cập nhật cơ sở dữ liệu",
      "example": "我们需要数据库更新。",
      "examplePinyin": "Wǒmen xūyào shùjùkù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật cơ sở dữ liệu."
    },
    {
      "word": "数据库优化",
      "pinyin": "shùjùkù yōuhuà",
      "meaning": "tối ưu hóa cơ sở dữ liệu",
      "example": "我们需要数据库优化。",
      "examplePinyin": "Wǒmen xūyào shùjùkù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa cơ sở dữ liệu."
    },
    {
      "word": "数据库导入",
      "pinyin": "shùjùkù dǎorù",
      "meaning": "nhập vào cơ sở dữ liệu",
      "example": "我们需要数据库导入。",
      "examplePinyin": "Wǒmen xūyào shùjùkù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào cơ sở dữ liệu."
    },
    {
      "word": "数据库导出",
      "pinyin": "shùjùkù dǎochū",
      "meaning": "xuất ra cơ sở dữ liệu",
      "example": "我们需要数据库导出。",
      "examplePinyin": "Wǒmen xūyào shùjùkù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra cơ sở dữ liệu."
    },
    {
      "word": "数据库备份",
      "pinyin": "shùjùkù bèifèn",
      "meaning": "sao lưu cơ sở dữ liệu",
      "example": "我们需要数据库备份。",
      "examplePinyin": "Wǒmen xūyào shùjùkù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu cơ sở dữ liệu."
    },
    {
      "word": "数据库同步",
      "pinyin": "shùjùkù tóngbù",
      "meaning": "đồng bộ cơ sở dữ liệu",
      "example": "我们需要数据库同步。",
      "examplePinyin": "Wǒmen xūyào shùjùkù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ cơ sở dữ liệu."
    },
    {
      "word": "数据库搜索",
      "pinyin": "shùjùkù sōusuǒ",
      "meaning": "tìm kiếm cơ sở dữ liệu",
      "example": "我们需要数据库搜索。",
      "examplePinyin": "Wǒmen xūyào shùjùkù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm cơ sở dữ liệu."
    },
    {
      "word": "数据库分类",
      "pinyin": "shùjùkù fēnlèi",
      "meaning": "phân loại cơ sở dữ liệu",
      "example": "我们需要数据库分类。",
      "examplePinyin": "Wǒmen xūyào shùjùkù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại cơ sở dữ liệu."
    },
    {
      "word": "数据库统计",
      "pinyin": "shùjùkù tǒngjì",
      "meaning": "thống kê cơ sở dữ liệu",
      "example": "我们需要数据库统计。",
      "examplePinyin": "Wǒmen xūyào shùjùkù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê cơ sở dữ liệu."
    },
    {
      "word": "数据库确认",
      "pinyin": "shùjùkù quèrèn",
      "meaning": "xác nhận cơ sở dữ liệu",
      "example": "我们需要数据库确认。",
      "examplePinyin": "Wǒmen xūyào shùjùkù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận cơ sở dữ liệu."
    },
    {
      "word": "数据库审核",
      "pinyin": "shùjùkù shěnhé",
      "meaning": "duyệt/kiểm duyệt cơ sở dữ liệu",
      "example": "我们需要数据库审核。",
      "examplePinyin": "Wǒmen xūyào shùjùkù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt cơ sở dữ liệu."
    },
    {
      "word": "数据库测试",
      "pinyin": "shùjùkù cèshì",
      "meaning": "kiểm thử cơ sở dữ liệu",
      "example": "我们需要数据库测试。",
      "examplePinyin": "Wǒmen xūyào shùjùkù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử cơ sở dữ liệu."
    },
    {
      "word": "数据库维护",
      "pinyin": "shùjùkù wéihù",
      "meaning": "bảo trì cơ sở dữ liệu",
      "example": "我们需要数据库维护。",
      "examplePinyin": "Wǒmen xūyào shùjùkù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì cơ sở dữ liệu."
    },
    {
      "word": "数据库设计",
      "pinyin": "shùjùkù shèjì",
      "meaning": "thiết kế cơ sở dữ liệu",
      "example": "我们需要数据库设计。",
      "examplePinyin": "Wǒmen xūyào shùjùkù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế cơ sở dữ liệu."
    },
    {
      "word": "数据库开发",
      "pinyin": "shùjùkù kāifā",
      "meaning": "phát triển cơ sở dữ liệu",
      "example": "我们需要数据库开发。",
      "examplePinyin": "Wǒmen xūyào shùjùkù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển cơ sở dữ liệu."
    },
    {
      "word": "数据库训练",
      "pinyin": "shùjùkù xùnliàn",
      "meaning": "huấn luyện cơ sở dữ liệu",
      "example": "我们需要数据库训练。",
      "examplePinyin": "Wǒmen xūyào shùjùkù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện cơ sở dữ liệu."
    },
    {
      "word": "数据库识别",
      "pinyin": "shùjùkù shíbié",
      "meaning": "nhận dạng cơ sở dữ liệu",
      "example": "我们需要数据库识别。",
      "examplePinyin": "Wǒmen xūyào shùjùkù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng cơ sở dữ liệu."
    },
    {
      "word": "数据库生成",
      "pinyin": "shùjùkù shēngchéng",
      "meaning": "tạo sinh cơ sở dữ liệu",
      "example": "我们需要数据库生成。",
      "examplePinyin": "Wǒmen xūyào shùjùkù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh cơ sở dữ liệu."
    },
    {
      "word": "数据库通知",
      "pinyin": "shùjùkù tōngzhī",
      "meaning": "thông báo cơ sở dữ liệu",
      "example": "我们需要数据库通知。",
      "examplePinyin": "Wǒmen xūyào shùjùkù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo cơ sở dữ liệu."
    },
    {
      "word": "数据库权限",
      "pinyin": "shùjùkù quánxiàn",
      "meaning": "quyền hạn cơ sở dữ liệu",
      "example": "我们需要数据库权限。",
      "examplePinyin": "Wǒmen xūyào shùjùkù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn cơ sở dữ liệu."
    },
    {
      "word": "数据库状态",
      "pinyin": "shùjùkù zhuàngtài",
      "meaning": "trạng thái cơ sở dữ liệu",
      "example": "我们需要数据库状态。",
      "examplePinyin": "Wǒmen xūyào shùjùkù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái cơ sở dữ liệu."
    },
    {
      "word": "数据库编号",
      "pinyin": "shùjùkù biānhào",
      "meaning": "mã số cơ sở dữ liệu",
      "example": "我们需要数据库编号。",
      "examplePinyin": "Wǒmen xūyào shùjùkù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số cơ sở dữ liệu."
    },
    {
      "word": "数据库模板",
      "pinyin": "shùjùkù múbǎn",
      "meaning": "mẫu/template cơ sở dữ liệu",
      "example": "我们需要数据库模板。",
      "examplePinyin": "Wǒmen xūyào shùjùkù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template cơ sở dữ liệu."
    },
    {
      "word": "数据库异常",
      "pinyin": "shùjùkù yìcháng",
      "meaning": "bất thường/lỗi cơ sở dữ liệu",
      "example": "我们需要数据库异常。",
      "examplePinyin": "Wǒmen xūyào shùjùkù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi cơ sở dữ liệu."
    },
    {
      "word": "账号管理",
      "pinyin": "zhànghào guǎnlǐ",
      "meaning": "quản lý tài khoản",
      "example": "我们需要账号管理。",
      "examplePinyin": "Wǒmen xūyào zhànghào guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tài khoản."
    },
    {
      "word": "账号处理",
      "pinyin": "zhànghào chǔlǐ",
      "meaning": "xử lý tài khoản",
      "example": "我们需要账号处理。",
      "examplePinyin": "Wǒmen xūyào zhànghào chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tài khoản."
    },
    {
      "word": "账号分析",
      "pinyin": "zhànghào fēnxī",
      "meaning": "phân tích tài khoản",
      "example": "我们需要账号分析。",
      "examplePinyin": "Wǒmen xūyào zhànghào fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tài khoản."
    },
    {
      "word": "账号检查",
      "pinyin": "zhànghào jiǎnchá",
      "meaning": "kiểm tra tài khoản",
      "example": "我们需要账号检查。",
      "examplePinyin": "Wǒmen xūyào zhànghào jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tài khoản."
    },
    {
      "word": "账号记录",
      "pinyin": "zhànghào jìlù",
      "meaning": "ghi chép tài khoản",
      "example": "我们需要账号记录。",
      "examplePinyin": "Wǒmen xūyào zhànghào jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tài khoản."
    },
    {
      "word": "账号设置",
      "pinyin": "zhànghào shèzhì",
      "meaning": "cài đặt tài khoản",
      "example": "我们需要账号设置。",
      "examplePinyin": "Wǒmen xūyào zhànghào shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tài khoản."
    },
    {
      "word": "账号更新",
      "pinyin": "zhànghào gēngxīn",
      "meaning": "cập nhật tài khoản",
      "example": "我们需要账号更新。",
      "examplePinyin": "Wǒmen xūyào zhànghào gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tài khoản."
    },
    {
      "word": "账号优化",
      "pinyin": "zhànghào yōuhuà",
      "meaning": "tối ưu hóa tài khoản",
      "example": "我们需要账号优化。",
      "examplePinyin": "Wǒmen xūyào zhànghào yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tài khoản."
    },
    {
      "word": "账号导入",
      "pinyin": "zhànghào dǎorù",
      "meaning": "nhập vào tài khoản",
      "example": "我们需要账号导入。",
      "examplePinyin": "Wǒmen xūyào zhànghào dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tài khoản."
    },
    {
      "word": "账号导出",
      "pinyin": "zhànghào dǎochū",
      "meaning": "xuất ra tài khoản",
      "example": "我们需要账号导出。",
      "examplePinyin": "Wǒmen xūyào zhànghào dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tài khoản."
    },
    {
      "word": "账号备份",
      "pinyin": "zhànghào bèifèn",
      "meaning": "sao lưu tài khoản",
      "example": "我们需要账号备份。",
      "examplePinyin": "Wǒmen xūyào zhànghào bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tài khoản."
    },
    {
      "word": "账号同步",
      "pinyin": "zhànghào tóngbù",
      "meaning": "đồng bộ tài khoản",
      "example": "我们需要账号同步。",
      "examplePinyin": "Wǒmen xūyào zhànghào tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tài khoản."
    },
    {
      "word": "账号搜索",
      "pinyin": "zhànghào sōusuǒ",
      "meaning": "tìm kiếm tài khoản",
      "example": "我们需要账号搜索。",
      "examplePinyin": "Wǒmen xūyào zhànghào sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tài khoản."
    },
    {
      "word": "账号分类",
      "pinyin": "zhànghào fēnlèi",
      "meaning": "phân loại tài khoản",
      "example": "我们需要账号分类。",
      "examplePinyin": "Wǒmen xūyào zhànghào fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tài khoản."
    },
    {
      "word": "账号统计",
      "pinyin": "zhànghào tǒngjì",
      "meaning": "thống kê tài khoản",
      "example": "我们需要账号统计。",
      "examplePinyin": "Wǒmen xūyào zhànghào tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tài khoản."
    },
    {
      "word": "账号确认",
      "pinyin": "zhànghào quèrèn",
      "meaning": "xác nhận tài khoản",
      "example": "我们需要账号确认。",
      "examplePinyin": "Wǒmen xūyào zhànghào quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tài khoản."
    },
    {
      "word": "账号审核",
      "pinyin": "zhànghào shěnhé",
      "meaning": "duyệt/kiểm duyệt tài khoản",
      "example": "我们需要账号审核。",
      "examplePinyin": "Wǒmen xūyào zhànghào shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tài khoản."
    },
    {
      "word": "账号测试",
      "pinyin": "zhànghào cèshì",
      "meaning": "kiểm thử tài khoản",
      "example": "我们需要账号测试。",
      "examplePinyin": "Wǒmen xūyào zhànghào cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tài khoản."
    },
    {
      "word": "账号维护",
      "pinyin": "zhànghào wéihù",
      "meaning": "bảo trì tài khoản",
      "example": "我们需要账号维护。",
      "examplePinyin": "Wǒmen xūyào zhànghào wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tài khoản."
    },
    {
      "word": "账号设计",
      "pinyin": "zhànghào shèjì",
      "meaning": "thiết kế tài khoản",
      "example": "我们需要账号设计。",
      "examplePinyin": "Wǒmen xūyào zhànghào shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tài khoản."
    },
    {
      "word": "账号开发",
      "pinyin": "zhànghào kāifā",
      "meaning": "phát triển tài khoản",
      "example": "我们需要账号开发。",
      "examplePinyin": "Wǒmen xūyào zhànghào kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tài khoản."
    },
    {
      "word": "账号训练",
      "pinyin": "zhànghào xùnliàn",
      "meaning": "huấn luyện tài khoản",
      "example": "我们需要账号训练。",
      "examplePinyin": "Wǒmen xūyào zhànghào xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tài khoản."
    },
    {
      "word": "账号识别",
      "pinyin": "zhànghào shíbié",
      "meaning": "nhận dạng tài khoản",
      "example": "我们需要账号识别。",
      "examplePinyin": "Wǒmen xūyào zhànghào shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tài khoản."
    },
    {
      "word": "账号生成",
      "pinyin": "zhànghào shēngchéng",
      "meaning": "tạo sinh tài khoản",
      "example": "我们需要账号生成。",
      "examplePinyin": "Wǒmen xūyào zhànghào shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tài khoản."
    },
    {
      "word": "账号通知",
      "pinyin": "zhànghào tōngzhī",
      "meaning": "thông báo tài khoản",
      "example": "我们需要账号通知。",
      "examplePinyin": "Wǒmen xūyào zhànghào tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tài khoản."
    },
    {
      "word": "账号权限",
      "pinyin": "zhànghào quánxiàn",
      "meaning": "quyền hạn tài khoản",
      "example": "我们需要账号权限。",
      "examplePinyin": "Wǒmen xūyào zhànghào quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tài khoản."
    },
    {
      "word": "账号状态",
      "pinyin": "zhànghào zhuàngtài",
      "meaning": "trạng thái tài khoản",
      "example": "我们需要账号状态。",
      "examplePinyin": "Wǒmen xūyào zhànghào zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tài khoản."
    },
    {
      "word": "账号编号",
      "pinyin": "zhànghào biānhào",
      "meaning": "mã số tài khoản",
      "example": "我们需要账号编号。",
      "examplePinyin": "Wǒmen xūyào zhànghào biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tài khoản."
    },
    {
      "word": "账号模板",
      "pinyin": "zhànghào múbǎn",
      "meaning": "mẫu/template tài khoản",
      "example": "我们需要账号模板。",
      "examplePinyin": "Wǒmen xūyào zhànghào múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tài khoản."
    },
    {
      "word": "账号异常",
      "pinyin": "zhànghào yìcháng",
      "meaning": "bất thường/lỗi tài khoản",
      "example": "我们需要账号异常。",
      "examplePinyin": "Wǒmen xūyào zhànghào yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tài khoản."
    },
    {
      "word": "密码管理",
      "pinyin": "mìmǎ guǎnlǐ",
      "meaning": "quản lý mật khẩu",
      "example": "我们需要密码管理。",
      "examplePinyin": "Wǒmen xūyào mìmǎ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý mật khẩu."
    },
    {
      "word": "密码处理",
      "pinyin": "mìmǎ chǔlǐ",
      "meaning": "xử lý mật khẩu",
      "example": "我们需要密码处理。",
      "examplePinyin": "Wǒmen xūyào mìmǎ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý mật khẩu."
    },
    {
      "word": "密码分析",
      "pinyin": "mìmǎ fēnxī",
      "meaning": "phân tích mật khẩu",
      "example": "我们需要密码分析。",
      "examplePinyin": "Wǒmen xūyào mìmǎ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích mật khẩu."
    },
    {
      "word": "密码检查",
      "pinyin": "mìmǎ jiǎnchá",
      "meaning": "kiểm tra mật khẩu",
      "example": "我们需要密码检查。",
      "examplePinyin": "Wǒmen xūyào mìmǎ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra mật khẩu."
    },
    {
      "word": "密码记录",
      "pinyin": "mìmǎ jìlù",
      "meaning": "ghi chép mật khẩu",
      "example": "我们需要密码记录。",
      "examplePinyin": "Wǒmen xūyào mìmǎ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép mật khẩu."
    },
    {
      "word": "密码设置",
      "pinyin": "mìmǎ shèzhì",
      "meaning": "cài đặt mật khẩu",
      "example": "我们需要密码设置。",
      "examplePinyin": "Wǒmen xūyào mìmǎ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt mật khẩu."
    },
    {
      "word": "密码更新",
      "pinyin": "mìmǎ gēngxīn",
      "meaning": "cập nhật mật khẩu",
      "example": "我们需要密码更新。",
      "examplePinyin": "Wǒmen xūyào mìmǎ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật mật khẩu."
    },
    {
      "word": "密码优化",
      "pinyin": "mìmǎ yōuhuà",
      "meaning": "tối ưu hóa mật khẩu",
      "example": "我们需要密码优化。",
      "examplePinyin": "Wǒmen xūyào mìmǎ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa mật khẩu."
    },
    {
      "word": "密码导入",
      "pinyin": "mìmǎ dǎorù",
      "meaning": "nhập vào mật khẩu",
      "example": "我们需要密码导入。",
      "examplePinyin": "Wǒmen xūyào mìmǎ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào mật khẩu."
    },
    {
      "word": "密码导出",
      "pinyin": "mìmǎ dǎochū",
      "meaning": "xuất ra mật khẩu",
      "example": "我们需要密码导出。",
      "examplePinyin": "Wǒmen xūyào mìmǎ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra mật khẩu."
    },
    {
      "word": "密码备份",
      "pinyin": "mìmǎ bèifèn",
      "meaning": "sao lưu mật khẩu",
      "example": "我们需要密码备份。",
      "examplePinyin": "Wǒmen xūyào mìmǎ bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu mật khẩu."
    },
    {
      "word": "密码同步",
      "pinyin": "mìmǎ tóngbù",
      "meaning": "đồng bộ mật khẩu",
      "example": "我们需要密码同步。",
      "examplePinyin": "Wǒmen xūyào mìmǎ tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ mật khẩu."
    },
    {
      "word": "密码搜索",
      "pinyin": "mìmǎ sōusuǒ",
      "meaning": "tìm kiếm mật khẩu",
      "example": "我们需要密码搜索。",
      "examplePinyin": "Wǒmen xūyào mìmǎ sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm mật khẩu."
    },
    {
      "word": "密码分类",
      "pinyin": "mìmǎ fēnlèi",
      "meaning": "phân loại mật khẩu",
      "example": "我们需要密码分类。",
      "examplePinyin": "Wǒmen xūyào mìmǎ fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại mật khẩu."
    },
    {
      "word": "密码统计",
      "pinyin": "mìmǎ tǒngjì",
      "meaning": "thống kê mật khẩu",
      "example": "我们需要密码统计。",
      "examplePinyin": "Wǒmen xūyào mìmǎ tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê mật khẩu."
    },
    {
      "word": "密码确认",
      "pinyin": "mìmǎ quèrèn",
      "meaning": "xác nhận mật khẩu",
      "example": "我们需要密码确认。",
      "examplePinyin": "Wǒmen xūyào mìmǎ quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận mật khẩu."
    },
    {
      "word": "密码审核",
      "pinyin": "mìmǎ shěnhé",
      "meaning": "duyệt/kiểm duyệt mật khẩu",
      "example": "我们需要密码审核。",
      "examplePinyin": "Wǒmen xūyào mìmǎ shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt mật khẩu."
    },
    {
      "word": "密码测试",
      "pinyin": "mìmǎ cèshì",
      "meaning": "kiểm thử mật khẩu",
      "example": "我们需要密码测试。",
      "examplePinyin": "Wǒmen xūyào mìmǎ cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử mật khẩu."
    },
    {
      "word": "密码维护",
      "pinyin": "mìmǎ wéihù",
      "meaning": "bảo trì mật khẩu",
      "example": "我们需要密码维护。",
      "examplePinyin": "Wǒmen xūyào mìmǎ wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì mật khẩu."
    },
    {
      "word": "密码设计",
      "pinyin": "mìmǎ shèjì",
      "meaning": "thiết kế mật khẩu",
      "example": "我们需要密码设计。",
      "examplePinyin": "Wǒmen xūyào mìmǎ shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế mật khẩu."
    },
    {
      "word": "密码开发",
      "pinyin": "mìmǎ kāifā",
      "meaning": "phát triển mật khẩu",
      "example": "我们需要密码开发。",
      "examplePinyin": "Wǒmen xūyào mìmǎ kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển mật khẩu."
    },
    {
      "word": "密码训练",
      "pinyin": "mìmǎ xùnliàn",
      "meaning": "huấn luyện mật khẩu",
      "example": "我们需要密码训练。",
      "examplePinyin": "Wǒmen xūyào mìmǎ xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện mật khẩu."
    },
    {
      "word": "密码识别",
      "pinyin": "mìmǎ shíbié",
      "meaning": "nhận dạng mật khẩu",
      "example": "我们需要密码识别。",
      "examplePinyin": "Wǒmen xūyào mìmǎ shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng mật khẩu."
    },
    {
      "word": "密码生成",
      "pinyin": "mìmǎ shēngchéng",
      "meaning": "tạo sinh mật khẩu",
      "example": "我们需要密码生成。",
      "examplePinyin": "Wǒmen xūyào mìmǎ shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh mật khẩu."
    },
    {
      "word": "密码通知",
      "pinyin": "mìmǎ tōngzhī",
      "meaning": "thông báo mật khẩu",
      "example": "我们需要密码通知。",
      "examplePinyin": "Wǒmen xūyào mìmǎ tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo mật khẩu."
    },
    {
      "word": "密码权限",
      "pinyin": "mìmǎ quánxiàn",
      "meaning": "quyền hạn mật khẩu",
      "example": "我们需要密码权限。",
      "examplePinyin": "Wǒmen xūyào mìmǎ quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn mật khẩu."
    },
    {
      "word": "密码状态",
      "pinyin": "mìmǎ zhuàngtài",
      "meaning": "trạng thái mật khẩu",
      "example": "我们需要密码状态。",
      "examplePinyin": "Wǒmen xūyào mìmǎ zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái mật khẩu."
    },
    {
      "word": "密码编号",
      "pinyin": "mìmǎ biānhào",
      "meaning": "mã số mật khẩu",
      "example": "我们需要密码编号。",
      "examplePinyin": "Wǒmen xūyào mìmǎ biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số mật khẩu."
    },
    {
      "word": "密码模板",
      "pinyin": "mìmǎ múbǎn",
      "meaning": "mẫu/template mật khẩu",
      "example": "我们需要密码模板。",
      "examplePinyin": "Wǒmen xūyào mìmǎ múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template mật khẩu."
    },
    {
      "word": "密码异常",
      "pinyin": "mìmǎ yìcháng",
      "meaning": "bất thường/lỗi mật khẩu",
      "example": "我们需要密码异常。",
      "examplePinyin": "Wǒmen xūyào mìmǎ yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi mật khẩu."
    },
    {
      "word": "网络管理",
      "pinyin": "wǎngluò guǎnlǐ",
      "meaning": "quản lý mạng",
      "example": "我们需要网络管理。",
      "examplePinyin": "Wǒmen xūyào wǎngluò guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý mạng."
    },
    {
      "word": "网络处理",
      "pinyin": "wǎngluò chǔlǐ",
      "meaning": "xử lý mạng",
      "example": "我们需要网络处理。",
      "examplePinyin": "Wǒmen xūyào wǎngluò chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý mạng."
    },
    {
      "word": "网络分析",
      "pinyin": "wǎngluò fēnxī",
      "meaning": "phân tích mạng",
      "example": "我们需要网络分析。",
      "examplePinyin": "Wǒmen xūyào wǎngluò fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích mạng."
    },
    {
      "word": "网络检查",
      "pinyin": "wǎngluò jiǎnchá",
      "meaning": "kiểm tra mạng",
      "example": "我们需要网络检查。",
      "examplePinyin": "Wǒmen xūyào wǎngluò jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra mạng."
    },
    {
      "word": "网络记录",
      "pinyin": "wǎngluò jìlù",
      "meaning": "ghi chép mạng",
      "example": "我们需要网络记录。",
      "examplePinyin": "Wǒmen xūyào wǎngluò jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép mạng."
    },
    {
      "word": "网络设置",
      "pinyin": "wǎngluò shèzhì",
      "meaning": "cài đặt mạng",
      "example": "我们需要网络设置。",
      "examplePinyin": "Wǒmen xūyào wǎngluò shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt mạng."
    },
    {
      "word": "网络更新",
      "pinyin": "wǎngluò gēngxīn",
      "meaning": "cập nhật mạng",
      "example": "我们需要网络更新。",
      "examplePinyin": "Wǒmen xūyào wǎngluò gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật mạng."
    },
    {
      "word": "网络优化",
      "pinyin": "wǎngluò yōuhuà",
      "meaning": "tối ưu hóa mạng",
      "example": "我们需要网络优化。",
      "examplePinyin": "Wǒmen xūyào wǎngluò yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa mạng."
    },
    {
      "word": "网络导入",
      "pinyin": "wǎngluò dǎorù",
      "meaning": "nhập vào mạng",
      "example": "我们需要网络导入。",
      "examplePinyin": "Wǒmen xūyào wǎngluò dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào mạng."
    },
    {
      "word": "网络导出",
      "pinyin": "wǎngluò dǎochū",
      "meaning": "xuất ra mạng",
      "example": "我们需要网络导出。",
      "examplePinyin": "Wǒmen xūyào wǎngluò dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra mạng."
    },
    {
      "word": "网络备份",
      "pinyin": "wǎngluò bèifèn",
      "meaning": "sao lưu mạng",
      "example": "我们需要网络备份。",
      "examplePinyin": "Wǒmen xūyào wǎngluò bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu mạng."
    },
    {
      "word": "网络同步",
      "pinyin": "wǎngluò tóngbù",
      "meaning": "đồng bộ mạng",
      "example": "我们需要网络同步。",
      "examplePinyin": "Wǒmen xūyào wǎngluò tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ mạng."
    },
    {
      "word": "网络搜索",
      "pinyin": "wǎngluò sōusuǒ",
      "meaning": "tìm kiếm mạng",
      "example": "我们需要网络搜索。",
      "examplePinyin": "Wǒmen xūyào wǎngluò sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm mạng."
    },
    {
      "word": "网络分类",
      "pinyin": "wǎngluò fēnlèi",
      "meaning": "phân loại mạng",
      "example": "我们需要网络分类。",
      "examplePinyin": "Wǒmen xūyào wǎngluò fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại mạng."
    },
    {
      "word": "网络统计",
      "pinyin": "wǎngluò tǒngjì",
      "meaning": "thống kê mạng",
      "example": "我们需要网络统计。",
      "examplePinyin": "Wǒmen xūyào wǎngluò tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê mạng."
    },
    {
      "word": "网络确认",
      "pinyin": "wǎngluò quèrèn",
      "meaning": "xác nhận mạng",
      "example": "我们需要网络确认。",
      "examplePinyin": "Wǒmen xūyào wǎngluò quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận mạng."
    },
    {
      "word": "网络审核",
      "pinyin": "wǎngluò shěnhé",
      "meaning": "duyệt/kiểm duyệt mạng",
      "example": "我们需要网络审核。",
      "examplePinyin": "Wǒmen xūyào wǎngluò shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt mạng."
    },
    {
      "word": "网络测试",
      "pinyin": "wǎngluò cèshì",
      "meaning": "kiểm thử mạng",
      "example": "我们需要网络测试。",
      "examplePinyin": "Wǒmen xūyào wǎngluò cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử mạng."
    },
    {
      "word": "网络维护",
      "pinyin": "wǎngluò wéihù",
      "meaning": "bảo trì mạng",
      "example": "我们需要网络维护。",
      "examplePinyin": "Wǒmen xūyào wǎngluò wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì mạng."
    },
    {
      "word": "网络设计",
      "pinyin": "wǎngluò shèjì",
      "meaning": "thiết kế mạng",
      "example": "我们需要网络设计。",
      "examplePinyin": "Wǒmen xūyào wǎngluò shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế mạng."
    },
    {
      "word": "网络开发",
      "pinyin": "wǎngluò kāifā",
      "meaning": "phát triển mạng",
      "example": "我们需要网络开发。",
      "examplePinyin": "Wǒmen xūyào wǎngluò kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển mạng."
    },
    {
      "word": "网络训练",
      "pinyin": "wǎngluò xùnliàn",
      "meaning": "huấn luyện mạng",
      "example": "我们需要网络训练。",
      "examplePinyin": "Wǒmen xūyào wǎngluò xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện mạng."
    },
    {
      "word": "网络识别",
      "pinyin": "wǎngluò shíbié",
      "meaning": "nhận dạng mạng",
      "example": "我们需要网络识别。",
      "examplePinyin": "Wǒmen xūyào wǎngluò shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng mạng."
    },
    {
      "word": "网络生成",
      "pinyin": "wǎngluò shēngchéng",
      "meaning": "tạo sinh mạng",
      "example": "我们需要网络生成。",
      "examplePinyin": "Wǒmen xūyào wǎngluò shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh mạng."
    },
    {
      "word": "网络通知",
      "pinyin": "wǎngluò tōngzhī",
      "meaning": "thông báo mạng",
      "example": "我们需要网络通知。",
      "examplePinyin": "Wǒmen xūyào wǎngluò tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo mạng."
    },
    {
      "word": "网络权限",
      "pinyin": "wǎngluò quánxiàn",
      "meaning": "quyền hạn mạng",
      "example": "我们需要网络权限。",
      "examplePinyin": "Wǒmen xūyào wǎngluò quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn mạng."
    },
    {
      "word": "网络状态",
      "pinyin": "wǎngluò zhuàngtài",
      "meaning": "trạng thái mạng",
      "example": "我们需要网络状态。",
      "examplePinyin": "Wǒmen xūyào wǎngluò zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái mạng."
    },
    {
      "word": "网络编号",
      "pinyin": "wǎngluò biānhào",
      "meaning": "mã số mạng",
      "example": "我们需要网络编号。",
      "examplePinyin": "Wǒmen xūyào wǎngluò biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số mạng."
    },
    {
      "word": "网络模板",
      "pinyin": "wǎngluò múbǎn",
      "meaning": "mẫu/template mạng",
      "example": "我们需要网络模板。",
      "examplePinyin": "Wǒmen xūyào wǎngluò múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template mạng."
    },
    {
      "word": "网络异常",
      "pinyin": "wǎngluò yìcháng",
      "meaning": "bất thường/lỗi mạng",
      "example": "我们需要网络异常。",
      "examplePinyin": "Wǒmen xūyào wǎngluò yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi mạng."
    },
    {
      "word": "接口管理",
      "pinyin": "jiēkǒu guǎnlǐ",
      "meaning": "quản lý giao diện/API",
      "example": "我们需要接口管理。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý giao diện/API."
    },
    {
      "word": "接口处理",
      "pinyin": "jiēkǒu chǔlǐ",
      "meaning": "xử lý giao diện/API",
      "example": "我们需要接口处理。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý giao diện/API."
    },
    {
      "word": "接口分析",
      "pinyin": "jiēkǒu fēnxī",
      "meaning": "phân tích giao diện/API",
      "example": "我们需要接口分析。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích giao diện/API."
    },
    {
      "word": "接口检查",
      "pinyin": "jiēkǒu jiǎnchá",
      "meaning": "kiểm tra giao diện/API",
      "example": "我们需要接口检查。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra giao diện/API."
    },
    {
      "word": "接口记录",
      "pinyin": "jiēkǒu jìlù",
      "meaning": "ghi chép giao diện/API",
      "example": "我们需要接口记录。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép giao diện/API."
    },
    {
      "word": "接口设置",
      "pinyin": "jiēkǒu shèzhì",
      "meaning": "cài đặt giao diện/API",
      "example": "我们需要接口设置。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt giao diện/API."
    },
    {
      "word": "接口更新",
      "pinyin": "jiēkǒu gēngxīn",
      "meaning": "cập nhật giao diện/API",
      "example": "我们需要接口更新。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật giao diện/API."
    },
    {
      "word": "接口优化",
      "pinyin": "jiēkǒu yōuhuà",
      "meaning": "tối ưu hóa giao diện/API",
      "example": "我们需要接口优化。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa giao diện/API."
    },
    {
      "word": "接口导入",
      "pinyin": "jiēkǒu dǎorù",
      "meaning": "nhập vào giao diện/API",
      "example": "我们需要接口导入。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào giao diện/API."
    },
    {
      "word": "接口导出",
      "pinyin": "jiēkǒu dǎochū",
      "meaning": "xuất ra giao diện/API",
      "example": "我们需要接口导出。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra giao diện/API."
    },
    {
      "word": "接口备份",
      "pinyin": "jiēkǒu bèifèn",
      "meaning": "sao lưu giao diện/API",
      "example": "我们需要接口备份。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu giao diện/API."
    },
    {
      "word": "接口同步",
      "pinyin": "jiēkǒu tóngbù",
      "meaning": "đồng bộ giao diện/API",
      "example": "我们需要接口同步。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ giao diện/API."
    },
    {
      "word": "接口搜索",
      "pinyin": "jiēkǒu sōusuǒ",
      "meaning": "tìm kiếm giao diện/API",
      "example": "我们需要接口搜索。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm giao diện/API."
    },
    {
      "word": "接口分类",
      "pinyin": "jiēkǒu fēnlèi",
      "meaning": "phân loại giao diện/API",
      "example": "我们需要接口分类。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại giao diện/API."
    },
    {
      "word": "接口统计",
      "pinyin": "jiēkǒu tǒngjì",
      "meaning": "thống kê giao diện/API",
      "example": "我们需要接口统计。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê giao diện/API."
    },
    {
      "word": "接口确认",
      "pinyin": "jiēkǒu quèrèn",
      "meaning": "xác nhận giao diện/API",
      "example": "我们需要接口确认。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận giao diện/API."
    },
    {
      "word": "接口审核",
      "pinyin": "jiēkǒu shěnhé",
      "meaning": "duyệt/kiểm duyệt giao diện/API",
      "example": "我们需要接口审核。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt giao diện/API."
    },
    {
      "word": "接口测试",
      "pinyin": "jiēkǒu cèshì",
      "meaning": "kiểm thử giao diện/API",
      "example": "我们需要接口测试。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử giao diện/API."
    },
    {
      "word": "接口维护",
      "pinyin": "jiēkǒu wéihù",
      "meaning": "bảo trì giao diện/API",
      "example": "我们需要接口维护。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì giao diện/API."
    },
    {
      "word": "接口设计",
      "pinyin": "jiēkǒu shèjì",
      "meaning": "thiết kế giao diện/API",
      "example": "我们需要接口设计。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế giao diện/API."
    },
    {
      "word": "接口开发",
      "pinyin": "jiēkǒu kāifā",
      "meaning": "phát triển giao diện/API",
      "example": "我们需要接口开发。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển giao diện/API."
    },
    {
      "word": "接口训练",
      "pinyin": "jiēkǒu xùnliàn",
      "meaning": "huấn luyện giao diện/API",
      "example": "我们需要接口训练。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện giao diện/API."
    },
    {
      "word": "接口识别",
      "pinyin": "jiēkǒu shíbié",
      "meaning": "nhận dạng giao diện/API",
      "example": "我们需要接口识别。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng giao diện/API."
    },
    {
      "word": "接口生成",
      "pinyin": "jiēkǒu shēngchéng",
      "meaning": "tạo sinh giao diện/API",
      "example": "我们需要接口生成。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh giao diện/API."
    },
    {
      "word": "接口通知",
      "pinyin": "jiēkǒu tōngzhī",
      "meaning": "thông báo giao diện/API",
      "example": "我们需要接口通知。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo giao diện/API."
    },
    {
      "word": "接口权限",
      "pinyin": "jiēkǒu quánxiàn",
      "meaning": "quyền hạn giao diện/API",
      "example": "我们需要接口权限。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn giao diện/API."
    },
    {
      "word": "接口状态",
      "pinyin": "jiēkǒu zhuàngtài",
      "meaning": "trạng thái giao diện/API",
      "example": "我们需要接口状态。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái giao diện/API."
    },
    {
      "word": "接口编号",
      "pinyin": "jiēkǒu biānhào",
      "meaning": "mã số giao diện/API",
      "example": "我们需要接口编号。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số giao diện/API."
    },
    {
      "word": "接口模板",
      "pinyin": "jiēkǒu múbǎn",
      "meaning": "mẫu/template giao diện/API",
      "example": "我们需要接口模板。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template giao diện/API."
    },
    {
      "word": "接口异常",
      "pinyin": "jiēkǒu yìcháng",
      "meaning": "bất thường/lỗi giao diện/API",
      "example": "我们需要接口异常。",
      "examplePinyin": "Wǒmen xūyào jiēkǒu yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi giao diện/API."
    },
    {
      "word": "文件管理",
      "pinyin": "wénjiàn guǎnlǐ",
      "meaning": "quản lý tệp/tài liệu",
      "example": "我们需要文件管理。",
      "examplePinyin": "Wǒmen xūyào wénjiàn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tệp/tài liệu."
    },
    {
      "word": "文件处理",
      "pinyin": "wénjiàn chǔlǐ",
      "meaning": "xử lý tệp/tài liệu",
      "example": "我们需要文件处理。",
      "examplePinyin": "Wǒmen xūyào wénjiàn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tệp/tài liệu."
    },
    {
      "word": "文件分析",
      "pinyin": "wénjiàn fēnxī",
      "meaning": "phân tích tệp/tài liệu",
      "example": "我们需要文件分析。",
      "examplePinyin": "Wǒmen xūyào wénjiàn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tệp/tài liệu."
    },
    {
      "word": "文件检查",
      "pinyin": "wénjiàn jiǎnchá",
      "meaning": "kiểm tra tệp/tài liệu",
      "example": "我们需要文件检查。",
      "examplePinyin": "Wǒmen xūyào wénjiàn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tệp/tài liệu."
    },
    {
      "word": "文件记录",
      "pinyin": "wénjiàn jìlù",
      "meaning": "ghi chép tệp/tài liệu",
      "example": "我们需要文件记录。",
      "examplePinyin": "Wǒmen xūyào wénjiàn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tệp/tài liệu."
    },
    {
      "word": "文件设置",
      "pinyin": "wénjiàn shèzhì",
      "meaning": "cài đặt tệp/tài liệu",
      "example": "我们需要文件设置。",
      "examplePinyin": "Wǒmen xūyào wénjiàn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tệp/tài liệu."
    },
    {
      "word": "文件更新",
      "pinyin": "wénjiàn gēngxīn",
      "meaning": "cập nhật tệp/tài liệu",
      "example": "我们需要文件更新。",
      "examplePinyin": "Wǒmen xūyào wénjiàn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tệp/tài liệu."
    },
    {
      "word": "文件优化",
      "pinyin": "wénjiàn yōuhuà",
      "meaning": "tối ưu hóa tệp/tài liệu",
      "example": "我们需要文件优化。",
      "examplePinyin": "Wǒmen xūyào wénjiàn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tệp/tài liệu."
    },
    {
      "word": "文件导入",
      "pinyin": "wénjiàn dǎorù",
      "meaning": "nhập vào tệp/tài liệu",
      "example": "我们需要文件导入。",
      "examplePinyin": "Wǒmen xūyào wénjiàn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tệp/tài liệu."
    },
    {
      "word": "文件导出",
      "pinyin": "wénjiàn dǎochū",
      "meaning": "xuất ra tệp/tài liệu",
      "example": "我们需要文件导出。",
      "examplePinyin": "Wǒmen xūyào wénjiàn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tệp/tài liệu."
    },
    {
      "word": "文件备份",
      "pinyin": "wénjiàn bèifèn",
      "meaning": "sao lưu tệp/tài liệu",
      "example": "我们需要文件备份。",
      "examplePinyin": "Wǒmen xūyào wénjiàn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tệp/tài liệu."
    },
    {
      "word": "文件同步",
      "pinyin": "wénjiàn tóngbù",
      "meaning": "đồng bộ tệp/tài liệu",
      "example": "我们需要文件同步。",
      "examplePinyin": "Wǒmen xūyào wénjiàn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tệp/tài liệu."
    },
    {
      "word": "文件搜索",
      "pinyin": "wénjiàn sōusuǒ",
      "meaning": "tìm kiếm tệp/tài liệu",
      "example": "我们需要文件搜索。",
      "examplePinyin": "Wǒmen xūyào wénjiàn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tệp/tài liệu."
    },
    {
      "word": "文件分类",
      "pinyin": "wénjiàn fēnlèi",
      "meaning": "phân loại tệp/tài liệu",
      "example": "我们需要文件分类。",
      "examplePinyin": "Wǒmen xūyào wénjiàn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tệp/tài liệu."
    },
    {
      "word": "文件统计",
      "pinyin": "wénjiàn tǒngjì",
      "meaning": "thống kê tệp/tài liệu",
      "example": "我们需要文件统计。",
      "examplePinyin": "Wǒmen xūyào wénjiàn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tệp/tài liệu."
    },
    {
      "word": "文件确认",
      "pinyin": "wénjiàn quèrèn",
      "meaning": "xác nhận tệp/tài liệu",
      "example": "我们需要文件确认。",
      "examplePinyin": "Wǒmen xūyào wénjiàn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tệp/tài liệu."
    },
    {
      "word": "文件审核",
      "pinyin": "wénjiàn shěnhé",
      "meaning": "duyệt/kiểm duyệt tệp/tài liệu",
      "example": "我们需要文件审核。",
      "examplePinyin": "Wǒmen xūyào wénjiàn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tệp/tài liệu."
    },
    {
      "word": "文件测试",
      "pinyin": "wénjiàn cèshì",
      "meaning": "kiểm thử tệp/tài liệu",
      "example": "我们需要文件测试。",
      "examplePinyin": "Wǒmen xūyào wénjiàn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tệp/tài liệu."
    },
    {
      "word": "文件维护",
      "pinyin": "wénjiàn wéihù",
      "meaning": "bảo trì tệp/tài liệu",
      "example": "我们需要文件维护。",
      "examplePinyin": "Wǒmen xūyào wénjiàn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tệp/tài liệu."
    },
    {
      "word": "文件设计",
      "pinyin": "wénjiàn shèjì",
      "meaning": "thiết kế tệp/tài liệu",
      "example": "我们需要文件设计。",
      "examplePinyin": "Wǒmen xūyào wénjiàn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tệp/tài liệu."
    },
    {
      "word": "文件开发",
      "pinyin": "wénjiàn kāifā",
      "meaning": "phát triển tệp/tài liệu",
      "example": "我们需要文件开发。",
      "examplePinyin": "Wǒmen xūyào wénjiàn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tệp/tài liệu."
    },
    {
      "word": "文件训练",
      "pinyin": "wénjiàn xùnliàn",
      "meaning": "huấn luyện tệp/tài liệu",
      "example": "我们需要文件训练。",
      "examplePinyin": "Wǒmen xūyào wénjiàn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tệp/tài liệu."
    },
    {
      "word": "文件识别",
      "pinyin": "wénjiàn shíbié",
      "meaning": "nhận dạng tệp/tài liệu",
      "example": "我们需要文件识别。",
      "examplePinyin": "Wǒmen xūyào wénjiàn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tệp/tài liệu."
    },
    {
      "word": "文件生成",
      "pinyin": "wénjiàn shēngchéng",
      "meaning": "tạo sinh tệp/tài liệu",
      "example": "我们需要文件生成。",
      "examplePinyin": "Wǒmen xūyào wénjiàn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tệp/tài liệu."
    },
    {
      "word": "文件通知",
      "pinyin": "wénjiàn tōngzhī",
      "meaning": "thông báo tệp/tài liệu",
      "example": "我们需要文件通知。",
      "examplePinyin": "Wǒmen xūyào wénjiàn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tệp/tài liệu."
    },
    {
      "word": "文件权限",
      "pinyin": "wénjiàn quánxiàn",
      "meaning": "quyền hạn tệp/tài liệu",
      "example": "我们需要文件权限。",
      "examplePinyin": "Wǒmen xūyào wénjiàn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tệp/tài liệu."
    },
    {
      "word": "文件状态",
      "pinyin": "wénjiàn zhuàngtài",
      "meaning": "trạng thái tệp/tài liệu",
      "example": "我们需要文件状态。",
      "examplePinyin": "Wǒmen xūyào wénjiàn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tệp/tài liệu."
    },
    {
      "word": "文件编号",
      "pinyin": "wénjiàn biānhào",
      "meaning": "mã số tệp/tài liệu",
      "example": "我们需要文件编号。",
      "examplePinyin": "Wǒmen xūyào wénjiàn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tệp/tài liệu."
    },
    {
      "word": "文件模板",
      "pinyin": "wénjiàn múbǎn",
      "meaning": "mẫu/template tệp/tài liệu",
      "example": "我们需要文件模板。",
      "examplePinyin": "Wǒmen xūyào wénjiàn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tệp/tài liệu."
    },
    {
      "word": "文件异常",
      "pinyin": "wénjiàn yìcháng",
      "meaning": "bất thường/lỗi tệp/tài liệu",
      "example": "我们需要文件异常。",
      "examplePinyin": "Wǒmen xūyào wénjiàn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tệp/tài liệu."
    },
    {
      "word": "表格管理",
      "pinyin": "biǎogé guǎnlǐ",
      "meaning": "quản lý bảng tính",
      "example": "我们需要表格管理。",
      "examplePinyin": "Wǒmen xūyào biǎogé guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý bảng tính."
    },
    {
      "word": "表格处理",
      "pinyin": "biǎogé chǔlǐ",
      "meaning": "xử lý bảng tính",
      "example": "我们需要表格处理。",
      "examplePinyin": "Wǒmen xūyào biǎogé chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý bảng tính."
    },
    {
      "word": "表格分析",
      "pinyin": "biǎogé fēnxī",
      "meaning": "phân tích bảng tính",
      "example": "我们需要表格分析。",
      "examplePinyin": "Wǒmen xūyào biǎogé fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích bảng tính."
    },
    {
      "word": "表格检查",
      "pinyin": "biǎogé jiǎnchá",
      "meaning": "kiểm tra bảng tính",
      "example": "我们需要表格检查。",
      "examplePinyin": "Wǒmen xūyào biǎogé jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra bảng tính."
    },
    {
      "word": "表格记录",
      "pinyin": "biǎogé jìlù",
      "meaning": "ghi chép bảng tính",
      "example": "我们需要表格记录。",
      "examplePinyin": "Wǒmen xūyào biǎogé jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép bảng tính."
    },
    {
      "word": "表格设置",
      "pinyin": "biǎogé shèzhì",
      "meaning": "cài đặt bảng tính",
      "example": "我们需要表格设置。",
      "examplePinyin": "Wǒmen xūyào biǎogé shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt bảng tính."
    },
    {
      "word": "表格更新",
      "pinyin": "biǎogé gēngxīn",
      "meaning": "cập nhật bảng tính",
      "example": "我们需要表格更新。",
      "examplePinyin": "Wǒmen xūyào biǎogé gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật bảng tính."
    },
    {
      "word": "表格优化",
      "pinyin": "biǎogé yōuhuà",
      "meaning": "tối ưu hóa bảng tính",
      "example": "我们需要表格优化。",
      "examplePinyin": "Wǒmen xūyào biǎogé yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa bảng tính."
    },
    {
      "word": "表格导入",
      "pinyin": "biǎogé dǎorù",
      "meaning": "nhập vào bảng tính",
      "example": "我们需要表格导入。",
      "examplePinyin": "Wǒmen xūyào biǎogé dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào bảng tính."
    },
    {
      "word": "表格导出",
      "pinyin": "biǎogé dǎochū",
      "meaning": "xuất ra bảng tính",
      "example": "我们需要表格导出。",
      "examplePinyin": "Wǒmen xūyào biǎogé dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra bảng tính."
    },
    {
      "word": "表格备份",
      "pinyin": "biǎogé bèifèn",
      "meaning": "sao lưu bảng tính",
      "example": "我们需要表格备份。",
      "examplePinyin": "Wǒmen xūyào biǎogé bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu bảng tính."
    },
    {
      "word": "表格同步",
      "pinyin": "biǎogé tóngbù",
      "meaning": "đồng bộ bảng tính",
      "example": "我们需要表格同步。",
      "examplePinyin": "Wǒmen xūyào biǎogé tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ bảng tính."
    },
    {
      "word": "表格搜索",
      "pinyin": "biǎogé sōusuǒ",
      "meaning": "tìm kiếm bảng tính",
      "example": "我们需要表格搜索。",
      "examplePinyin": "Wǒmen xūyào biǎogé sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm bảng tính."
    },
    {
      "word": "表格分类",
      "pinyin": "biǎogé fēnlèi",
      "meaning": "phân loại bảng tính",
      "example": "我们需要表格分类。",
      "examplePinyin": "Wǒmen xūyào biǎogé fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại bảng tính."
    },
    {
      "word": "表格统计",
      "pinyin": "biǎogé tǒngjì",
      "meaning": "thống kê bảng tính",
      "example": "我们需要表格统计。",
      "examplePinyin": "Wǒmen xūyào biǎogé tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê bảng tính."
    },
    {
      "word": "表格确认",
      "pinyin": "biǎogé quèrèn",
      "meaning": "xác nhận bảng tính",
      "example": "我们需要表格确认。",
      "examplePinyin": "Wǒmen xūyào biǎogé quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận bảng tính."
    },
    {
      "word": "表格审核",
      "pinyin": "biǎogé shěnhé",
      "meaning": "duyệt/kiểm duyệt bảng tính",
      "example": "我们需要表格审核。",
      "examplePinyin": "Wǒmen xūyào biǎogé shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt bảng tính."
    },
    {
      "word": "表格测试",
      "pinyin": "biǎogé cèshì",
      "meaning": "kiểm thử bảng tính",
      "example": "我们需要表格测试。",
      "examplePinyin": "Wǒmen xūyào biǎogé cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử bảng tính."
    },
    {
      "word": "表格维护",
      "pinyin": "biǎogé wéihù",
      "meaning": "bảo trì bảng tính",
      "example": "我们需要表格维护。",
      "examplePinyin": "Wǒmen xūyào biǎogé wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì bảng tính."
    },
    {
      "word": "表格设计",
      "pinyin": "biǎogé shèjì",
      "meaning": "thiết kế bảng tính",
      "example": "我们需要表格设计。",
      "examplePinyin": "Wǒmen xūyào biǎogé shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế bảng tính."
    },
    {
      "word": "表格开发",
      "pinyin": "biǎogé kāifā",
      "meaning": "phát triển bảng tính",
      "example": "我们需要表格开发。",
      "examplePinyin": "Wǒmen xūyào biǎogé kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển bảng tính."
    },
    {
      "word": "表格训练",
      "pinyin": "biǎogé xùnliàn",
      "meaning": "huấn luyện bảng tính",
      "example": "我们需要表格训练。",
      "examplePinyin": "Wǒmen xūyào biǎogé xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện bảng tính."
    },
    {
      "word": "表格识别",
      "pinyin": "biǎogé shíbié",
      "meaning": "nhận dạng bảng tính",
      "example": "我们需要表格识别。",
      "examplePinyin": "Wǒmen xūyào biǎogé shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng bảng tính."
    },
    {
      "word": "表格生成",
      "pinyin": "biǎogé shēngchéng",
      "meaning": "tạo sinh bảng tính",
      "example": "我们需要表格生成。",
      "examplePinyin": "Wǒmen xūyào biǎogé shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh bảng tính."
    },
    {
      "word": "表格通知",
      "pinyin": "biǎogé tōngzhī",
      "meaning": "thông báo bảng tính",
      "example": "我们需要表格通知。",
      "examplePinyin": "Wǒmen xūyào biǎogé tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo bảng tính."
    },
    {
      "word": "表格权限",
      "pinyin": "biǎogé quánxiàn",
      "meaning": "quyền hạn bảng tính",
      "example": "我们需要表格权限。",
      "examplePinyin": "Wǒmen xūyào biǎogé quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn bảng tính."
    },
    {
      "word": "表格状态",
      "pinyin": "biǎogé zhuàngtài",
      "meaning": "trạng thái bảng tính",
      "example": "我们需要表格状态。",
      "examplePinyin": "Wǒmen xūyào biǎogé zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái bảng tính."
    },
    {
      "word": "表格编号",
      "pinyin": "biǎogé biānhào",
      "meaning": "mã số bảng tính",
      "example": "我们需要表格编号。",
      "examplePinyin": "Wǒmen xūyào biǎogé biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số bảng tính."
    },
    {
      "word": "表格模板",
      "pinyin": "biǎogé múbǎn",
      "meaning": "mẫu/template bảng tính",
      "example": "我们需要表格模板。",
      "examplePinyin": "Wǒmen xūyào biǎogé múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template bảng tính."
    },
    {
      "word": "表格异常",
      "pinyin": "biǎogé yìcháng",
      "meaning": "bất thường/lỗi bảng tính",
      "example": "我们需要表格异常。",
      "examplePinyin": "Wǒmen xūyào biǎogé yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi bảng tính."
    },
    {
      "word": "图片管理",
      "pinyin": "túpiàn guǎnlǐ",
      "meaning": "quản lý hình ảnh",
      "example": "我们需要图片管理。",
      "examplePinyin": "Wǒmen xūyào túpiàn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hình ảnh."
    },
    {
      "word": "图片处理",
      "pinyin": "túpiàn chǔlǐ",
      "meaning": "xử lý hình ảnh",
      "example": "我们需要图片处理。",
      "examplePinyin": "Wǒmen xūyào túpiàn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hình ảnh."
    },
    {
      "word": "图片分析",
      "pinyin": "túpiàn fēnxī",
      "meaning": "phân tích hình ảnh",
      "example": "我们需要图片分析。",
      "examplePinyin": "Wǒmen xūyào túpiàn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hình ảnh."
    },
    {
      "word": "图片检查",
      "pinyin": "túpiàn jiǎnchá",
      "meaning": "kiểm tra hình ảnh",
      "example": "我们需要图片检查。",
      "examplePinyin": "Wǒmen xūyào túpiàn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hình ảnh."
    },
    {
      "word": "图片记录",
      "pinyin": "túpiàn jìlù",
      "meaning": "ghi chép hình ảnh",
      "example": "我们需要图片记录。",
      "examplePinyin": "Wǒmen xūyào túpiàn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hình ảnh."
    },
    {
      "word": "图片设置",
      "pinyin": "túpiàn shèzhì",
      "meaning": "cài đặt hình ảnh",
      "example": "我们需要图片设置。",
      "examplePinyin": "Wǒmen xūyào túpiàn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hình ảnh."
    },
    {
      "word": "图片更新",
      "pinyin": "túpiàn gēngxīn",
      "meaning": "cập nhật hình ảnh",
      "example": "我们需要图片更新。",
      "examplePinyin": "Wǒmen xūyào túpiàn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hình ảnh."
    },
    {
      "word": "图片优化",
      "pinyin": "túpiàn yōuhuà",
      "meaning": "tối ưu hóa hình ảnh",
      "example": "我们需要图片优化。",
      "examplePinyin": "Wǒmen xūyào túpiàn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hình ảnh."
    },
    {
      "word": "图片导入",
      "pinyin": "túpiàn dǎorù",
      "meaning": "nhập vào hình ảnh",
      "example": "我们需要图片导入。",
      "examplePinyin": "Wǒmen xūyào túpiàn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hình ảnh."
    },
    {
      "word": "图片导出",
      "pinyin": "túpiàn dǎochū",
      "meaning": "xuất ra hình ảnh",
      "example": "我们需要图片导出。",
      "examplePinyin": "Wǒmen xūyào túpiàn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hình ảnh."
    },
    {
      "word": "图片备份",
      "pinyin": "túpiàn bèifèn",
      "meaning": "sao lưu hình ảnh",
      "example": "我们需要图片备份。",
      "examplePinyin": "Wǒmen xūyào túpiàn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu hình ảnh."
    },
    {
      "word": "图片同步",
      "pinyin": "túpiàn tóngbù",
      "meaning": "đồng bộ hình ảnh",
      "example": "我们需要图片同步。",
      "examplePinyin": "Wǒmen xūyào túpiàn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ hình ảnh."
    },
    {
      "word": "图片搜索",
      "pinyin": "túpiàn sōusuǒ",
      "meaning": "tìm kiếm hình ảnh",
      "example": "我们需要图片搜索。",
      "examplePinyin": "Wǒmen xūyào túpiàn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm hình ảnh."
    },
    {
      "word": "图片分类",
      "pinyin": "túpiàn fēnlèi",
      "meaning": "phân loại hình ảnh",
      "example": "我们需要图片分类。",
      "examplePinyin": "Wǒmen xūyào túpiàn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại hình ảnh."
    },
    {
      "word": "图片统计",
      "pinyin": "túpiàn tǒngjì",
      "meaning": "thống kê hình ảnh",
      "example": "我们需要图片统计。",
      "examplePinyin": "Wǒmen xūyào túpiàn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê hình ảnh."
    },
    {
      "word": "图片确认",
      "pinyin": "túpiàn quèrèn",
      "meaning": "xác nhận hình ảnh",
      "example": "我们需要图片确认。",
      "examplePinyin": "Wǒmen xūyào túpiàn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận hình ảnh."
    },
    {
      "word": "图片审核",
      "pinyin": "túpiàn shěnhé",
      "meaning": "duyệt/kiểm duyệt hình ảnh",
      "example": "我们需要图片审核。",
      "examplePinyin": "Wǒmen xūyào túpiàn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt hình ảnh."
    },
    {
      "word": "图片测试",
      "pinyin": "túpiàn cèshì",
      "meaning": "kiểm thử hình ảnh",
      "example": "我们需要图片测试。",
      "examplePinyin": "Wǒmen xūyào túpiàn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử hình ảnh."
    },
    {
      "word": "图片维护",
      "pinyin": "túpiàn wéihù",
      "meaning": "bảo trì hình ảnh",
      "example": "我们需要图片维护。",
      "examplePinyin": "Wǒmen xūyào túpiàn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì hình ảnh."
    },
    {
      "word": "图片设计",
      "pinyin": "túpiàn shèjì",
      "meaning": "thiết kế hình ảnh",
      "example": "我们需要图片设计。",
      "examplePinyin": "Wǒmen xūyào túpiàn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế hình ảnh."
    },
    {
      "word": "图片开发",
      "pinyin": "túpiàn kāifā",
      "meaning": "phát triển hình ảnh",
      "example": "我们需要图片开发。",
      "examplePinyin": "Wǒmen xūyào túpiàn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển hình ảnh."
    },
    {
      "word": "图片训练",
      "pinyin": "túpiàn xùnliàn",
      "meaning": "huấn luyện hình ảnh",
      "example": "我们需要图片训练。",
      "examplePinyin": "Wǒmen xūyào túpiàn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện hình ảnh."
    },
    {
      "word": "图片识别",
      "pinyin": "túpiàn shíbié",
      "meaning": "nhận dạng hình ảnh",
      "example": "我们需要图片识别。",
      "examplePinyin": "Wǒmen xūyào túpiàn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng hình ảnh."
    },
    {
      "word": "图片生成",
      "pinyin": "túpiàn shēngchéng",
      "meaning": "tạo sinh hình ảnh",
      "example": "我们需要图片生成。",
      "examplePinyin": "Wǒmen xūyào túpiàn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh hình ảnh."
    },
    {
      "word": "图片通知",
      "pinyin": "túpiàn tōngzhī",
      "meaning": "thông báo hình ảnh",
      "example": "我们需要图片通知。",
      "examplePinyin": "Wǒmen xūyào túpiàn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo hình ảnh."
    },
    {
      "word": "图片权限",
      "pinyin": "túpiàn quánxiàn",
      "meaning": "quyền hạn hình ảnh",
      "example": "我们需要图片权限。",
      "examplePinyin": "Wǒmen xūyào túpiàn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn hình ảnh."
    },
    {
      "word": "图片状态",
      "pinyin": "túpiàn zhuàngtài",
      "meaning": "trạng thái hình ảnh",
      "example": "我们需要图片状态。",
      "examplePinyin": "Wǒmen xūyào túpiàn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái hình ảnh."
    },
    {
      "word": "图片编号",
      "pinyin": "túpiàn biānhào",
      "meaning": "mã số hình ảnh",
      "example": "我们需要图片编号。",
      "examplePinyin": "Wǒmen xūyào túpiàn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số hình ảnh."
    },
    {
      "word": "图片模板",
      "pinyin": "túpiàn múbǎn",
      "meaning": "mẫu/template hình ảnh",
      "example": "我们需要图片模板。",
      "examplePinyin": "Wǒmen xūyào túpiàn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template hình ảnh."
    },
    {
      "word": "图片异常",
      "pinyin": "túpiàn yìcháng",
      "meaning": "bất thường/lỗi hình ảnh",
      "example": "我们需要图片异常。",
      "examplePinyin": "Wǒmen xūyào túpiàn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi hình ảnh."
    },
    {
      "word": "视频管理",
      "pinyin": "shìpín guǎnlǐ",
      "meaning": "quản lý video",
      "example": "我们需要视频管理。",
      "examplePinyin": "Wǒmen xūyào shìpín guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý video."
    },
    {
      "word": "视频处理",
      "pinyin": "shìpín chǔlǐ",
      "meaning": "xử lý video",
      "example": "我们需要视频处理。",
      "examplePinyin": "Wǒmen xūyào shìpín chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý video."
    },
    {
      "word": "视频分析",
      "pinyin": "shìpín fēnxī",
      "meaning": "phân tích video",
      "example": "我们需要视频分析。",
      "examplePinyin": "Wǒmen xūyào shìpín fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích video."
    },
    {
      "word": "视频检查",
      "pinyin": "shìpín jiǎnchá",
      "meaning": "kiểm tra video",
      "example": "我们需要视频检查。",
      "examplePinyin": "Wǒmen xūyào shìpín jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra video."
    },
    {
      "word": "视频记录",
      "pinyin": "shìpín jìlù",
      "meaning": "ghi chép video",
      "example": "我们需要视频记录。",
      "examplePinyin": "Wǒmen xūyào shìpín jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép video."
    },
    {
      "word": "视频设置",
      "pinyin": "shìpín shèzhì",
      "meaning": "cài đặt video",
      "example": "我们需要视频设置。",
      "examplePinyin": "Wǒmen xūyào shìpín shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt video."
    },
    {
      "word": "视频更新",
      "pinyin": "shìpín gēngxīn",
      "meaning": "cập nhật video",
      "example": "我们需要视频更新。",
      "examplePinyin": "Wǒmen xūyào shìpín gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật video."
    },
    {
      "word": "视频优化",
      "pinyin": "shìpín yōuhuà",
      "meaning": "tối ưu hóa video",
      "example": "我们需要视频优化。",
      "examplePinyin": "Wǒmen xūyào shìpín yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa video."
    },
    {
      "word": "视频导入",
      "pinyin": "shìpín dǎorù",
      "meaning": "nhập vào video",
      "example": "我们需要视频导入。",
      "examplePinyin": "Wǒmen xūyào shìpín dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào video."
    },
    {
      "word": "视频导出",
      "pinyin": "shìpín dǎochū",
      "meaning": "xuất ra video",
      "example": "我们需要视频导出。",
      "examplePinyin": "Wǒmen xūyào shìpín dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra video."
    },
    {
      "word": "视频备份",
      "pinyin": "shìpín bèifèn",
      "meaning": "sao lưu video",
      "example": "我们需要视频备份。",
      "examplePinyin": "Wǒmen xūyào shìpín bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu video."
    },
    {
      "word": "视频同步",
      "pinyin": "shìpín tóngbù",
      "meaning": "đồng bộ video",
      "example": "我们需要视频同步。",
      "examplePinyin": "Wǒmen xūyào shìpín tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ video."
    },
    {
      "word": "视频搜索",
      "pinyin": "shìpín sōusuǒ",
      "meaning": "tìm kiếm video",
      "example": "我们需要视频搜索。",
      "examplePinyin": "Wǒmen xūyào shìpín sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm video."
    },
    {
      "word": "视频分类",
      "pinyin": "shìpín fēnlèi",
      "meaning": "phân loại video",
      "example": "我们需要视频分类。",
      "examplePinyin": "Wǒmen xūyào shìpín fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại video."
    },
    {
      "word": "视频统计",
      "pinyin": "shìpín tǒngjì",
      "meaning": "thống kê video",
      "example": "我们需要视频统计。",
      "examplePinyin": "Wǒmen xūyào shìpín tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê video."
    },
    {
      "word": "视频确认",
      "pinyin": "shìpín quèrèn",
      "meaning": "xác nhận video",
      "example": "我们需要视频确认。",
      "examplePinyin": "Wǒmen xūyào shìpín quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận video."
    },
    {
      "word": "视频审核",
      "pinyin": "shìpín shěnhé",
      "meaning": "duyệt/kiểm duyệt video",
      "example": "我们需要视频审核。",
      "examplePinyin": "Wǒmen xūyào shìpín shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt video."
    },
    {
      "word": "视频测试",
      "pinyin": "shìpín cèshì",
      "meaning": "kiểm thử video",
      "example": "我们需要视频测试。",
      "examplePinyin": "Wǒmen xūyào shìpín cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử video."
    },
    {
      "word": "视频维护",
      "pinyin": "shìpín wéihù",
      "meaning": "bảo trì video",
      "example": "我们需要视频维护。",
      "examplePinyin": "Wǒmen xūyào shìpín wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì video."
    },
    {
      "word": "视频设计",
      "pinyin": "shìpín shèjì",
      "meaning": "thiết kế video",
      "example": "我们需要视频设计。",
      "examplePinyin": "Wǒmen xūyào shìpín shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế video."
    },
    {
      "word": "视频开发",
      "pinyin": "shìpín kāifā",
      "meaning": "phát triển video",
      "example": "我们需要视频开发。",
      "examplePinyin": "Wǒmen xūyào shìpín kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển video."
    },
    {
      "word": "视频训练",
      "pinyin": "shìpín xùnliàn",
      "meaning": "huấn luyện video",
      "example": "我们需要视频训练。",
      "examplePinyin": "Wǒmen xūyào shìpín xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện video."
    },
    {
      "word": "视频识别",
      "pinyin": "shìpín shíbié",
      "meaning": "nhận dạng video",
      "example": "我们需要视频识别。",
      "examplePinyin": "Wǒmen xūyào shìpín shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng video."
    },
    {
      "word": "视频生成",
      "pinyin": "shìpín shēngchéng",
      "meaning": "tạo sinh video",
      "example": "我们需要视频生成。",
      "examplePinyin": "Wǒmen xūyào shìpín shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh video."
    },
    {
      "word": "视频通知",
      "pinyin": "shìpín tōngzhī",
      "meaning": "thông báo video",
      "example": "我们需要视频通知。",
      "examplePinyin": "Wǒmen xūyào shìpín tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo video."
    },
    {
      "word": "视频权限",
      "pinyin": "shìpín quánxiàn",
      "meaning": "quyền hạn video",
      "example": "我们需要视频权限。",
      "examplePinyin": "Wǒmen xūyào shìpín quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn video."
    },
    {
      "word": "视频状态",
      "pinyin": "shìpín zhuàngtài",
      "meaning": "trạng thái video",
      "example": "我们需要视频状态。",
      "examplePinyin": "Wǒmen xūyào shìpín zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái video."
    },
    {
      "word": "视频编号",
      "pinyin": "shìpín biānhào",
      "meaning": "mã số video",
      "example": "我们需要视频编号。",
      "examplePinyin": "Wǒmen xūyào shìpín biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số video."
    },
    {
      "word": "视频模板",
      "pinyin": "shìpín múbǎn",
      "meaning": "mẫu/template video",
      "example": "我们需要视频模板。",
      "examplePinyin": "Wǒmen xūyào shìpín múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template video."
    },
    {
      "word": "视频异常",
      "pinyin": "shìpín yìcháng",
      "meaning": "bất thường/lỗi video",
      "example": "我们需要视频异常。",
      "examplePinyin": "Wǒmen xūyào shìpín yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi video."
    },
    {
      "word": "模型管理",
      "pinyin": "móxíng guǎnlǐ",
      "meaning": "quản lý mô hình",
      "example": "我们需要模型管理。",
      "examplePinyin": "Wǒmen xūyào móxíng guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý mô hình."
    },
    {
      "word": "模型处理",
      "pinyin": "móxíng chǔlǐ",
      "meaning": "xử lý mô hình",
      "example": "我们需要模型处理。",
      "examplePinyin": "Wǒmen xūyào móxíng chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý mô hình."
    },
    {
      "word": "模型分析",
      "pinyin": "móxíng fēnxī",
      "meaning": "phân tích mô hình",
      "example": "我们需要模型分析。",
      "examplePinyin": "Wǒmen xūyào móxíng fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích mô hình."
    },
    {
      "word": "模型检查",
      "pinyin": "móxíng jiǎnchá",
      "meaning": "kiểm tra mô hình",
      "example": "我们需要模型检查。",
      "examplePinyin": "Wǒmen xūyào móxíng jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra mô hình."
    },
    {
      "word": "模型记录",
      "pinyin": "móxíng jìlù",
      "meaning": "ghi chép mô hình",
      "example": "我们需要模型记录。",
      "examplePinyin": "Wǒmen xūyào móxíng jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép mô hình."
    },
    {
      "word": "模型设置",
      "pinyin": "móxíng shèzhì",
      "meaning": "cài đặt mô hình",
      "example": "我们需要模型设置。",
      "examplePinyin": "Wǒmen xūyào móxíng shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt mô hình."
    },
    {
      "word": "模型更新",
      "pinyin": "móxíng gēngxīn",
      "meaning": "cập nhật mô hình",
      "example": "我们需要模型更新。",
      "examplePinyin": "Wǒmen xūyào móxíng gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật mô hình."
    },
    {
      "word": "模型优化",
      "pinyin": "móxíng yōuhuà",
      "meaning": "tối ưu hóa mô hình",
      "example": "我们需要模型优化。",
      "examplePinyin": "Wǒmen xūyào móxíng yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa mô hình."
    },
    {
      "word": "模型导入",
      "pinyin": "móxíng dǎorù",
      "meaning": "nhập vào mô hình",
      "example": "我们需要模型导入。",
      "examplePinyin": "Wǒmen xūyào móxíng dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào mô hình."
    },
    {
      "word": "模型导出",
      "pinyin": "móxíng dǎochū",
      "meaning": "xuất ra mô hình",
      "example": "我们需要模型导出。",
      "examplePinyin": "Wǒmen xūyào móxíng dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra mô hình."
    },
    {
      "word": "模型备份",
      "pinyin": "móxíng bèifèn",
      "meaning": "sao lưu mô hình",
      "example": "我们需要模型备份。",
      "examplePinyin": "Wǒmen xūyào móxíng bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu mô hình."
    },
    {
      "word": "模型同步",
      "pinyin": "móxíng tóngbù",
      "meaning": "đồng bộ mô hình",
      "example": "我们需要模型同步。",
      "examplePinyin": "Wǒmen xūyào móxíng tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ mô hình."
    },
    {
      "word": "模型搜索",
      "pinyin": "móxíng sōusuǒ",
      "meaning": "tìm kiếm mô hình",
      "example": "我们需要模型搜索。",
      "examplePinyin": "Wǒmen xūyào móxíng sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm mô hình."
    },
    {
      "word": "模型分类",
      "pinyin": "móxíng fēnlèi",
      "meaning": "phân loại mô hình",
      "example": "我们需要模型分类。",
      "examplePinyin": "Wǒmen xūyào móxíng fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại mô hình."
    },
    {
      "word": "模型统计",
      "pinyin": "móxíng tǒngjì",
      "meaning": "thống kê mô hình",
      "example": "我们需要模型统计。",
      "examplePinyin": "Wǒmen xūyào móxíng tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê mô hình."
    },
    {
      "word": "模型确认",
      "pinyin": "móxíng quèrèn",
      "meaning": "xác nhận mô hình",
      "example": "我们需要模型确认。",
      "examplePinyin": "Wǒmen xūyào móxíng quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận mô hình."
    },
    {
      "word": "模型审核",
      "pinyin": "móxíng shěnhé",
      "meaning": "duyệt/kiểm duyệt mô hình",
      "example": "我们需要模型审核。",
      "examplePinyin": "Wǒmen xūyào móxíng shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt mô hình."
    },
    {
      "word": "模型测试",
      "pinyin": "móxíng cèshì",
      "meaning": "kiểm thử mô hình",
      "example": "我们需要模型测试。",
      "examplePinyin": "Wǒmen xūyào móxíng cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử mô hình."
    },
    {
      "word": "模型维护",
      "pinyin": "móxíng wéihù",
      "meaning": "bảo trì mô hình",
      "example": "我们需要模型维护。",
      "examplePinyin": "Wǒmen xūyào móxíng wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì mô hình."
    },
    {
      "word": "模型设计",
      "pinyin": "móxíng shèjì",
      "meaning": "thiết kế mô hình",
      "example": "我们需要模型设计。",
      "examplePinyin": "Wǒmen xūyào móxíng shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế mô hình."
    },
    {
      "word": "模型开发",
      "pinyin": "móxíng kāifā",
      "meaning": "phát triển mô hình",
      "example": "我们需要模型开发。",
      "examplePinyin": "Wǒmen xūyào móxíng kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển mô hình."
    },
    {
      "word": "模型训练",
      "pinyin": "móxíng xùnliàn",
      "meaning": "huấn luyện mô hình",
      "example": "我们需要模型训练。",
      "examplePinyin": "Wǒmen xūyào móxíng xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện mô hình."
    },
    {
      "word": "模型识别",
      "pinyin": "móxíng shíbié",
      "meaning": "nhận dạng mô hình",
      "example": "我们需要模型识别。",
      "examplePinyin": "Wǒmen xūyào móxíng shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng mô hình."
    },
    {
      "word": "模型生成",
      "pinyin": "móxíng shēngchéng",
      "meaning": "tạo sinh mô hình",
      "example": "我们需要模型生成。",
      "examplePinyin": "Wǒmen xūyào móxíng shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh mô hình."
    },
    {
      "word": "模型通知",
      "pinyin": "móxíng tōngzhī",
      "meaning": "thông báo mô hình",
      "example": "我们需要模型通知。",
      "examplePinyin": "Wǒmen xūyào móxíng tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo mô hình."
    },
    {
      "word": "模型权限",
      "pinyin": "móxíng quánxiàn",
      "meaning": "quyền hạn mô hình",
      "example": "我们需要模型权限。",
      "examplePinyin": "Wǒmen xūyào móxíng quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn mô hình."
    },
    {
      "word": "模型状态",
      "pinyin": "móxíng zhuàngtài",
      "meaning": "trạng thái mô hình",
      "example": "我们需要模型状态。",
      "examplePinyin": "Wǒmen xūyào móxíng zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái mô hình."
    },
    {
      "word": "模型编号",
      "pinyin": "móxíng biānhào",
      "meaning": "mã số mô hình",
      "example": "我们需要模型编号。",
      "examplePinyin": "Wǒmen xūyào móxíng biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số mô hình."
    },
    {
      "word": "模型模板",
      "pinyin": "móxíng múbǎn",
      "meaning": "mẫu/template mô hình",
      "example": "我们需要模型模板。",
      "examplePinyin": "Wǒmen xūyào móxíng múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template mô hình."
    },
    {
      "word": "模型异常",
      "pinyin": "móxíng yìcháng",
      "meaning": "bất thường/lỗi mô hình",
      "example": "我们需要模型异常。",
      "examplePinyin": "Wǒmen xūyào móxíng yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi mô hình."
    },
    {
      "word": "算法管理",
      "pinyin": "suànfǎ guǎnlǐ",
      "meaning": "quản lý thuật toán",
      "example": "我们需要算法管理。",
      "examplePinyin": "Wǒmen xūyào suànfǎ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý thuật toán."
    },
    {
      "word": "算法处理",
      "pinyin": "suànfǎ chǔlǐ",
      "meaning": "xử lý thuật toán",
      "example": "我们需要算法处理。",
      "examplePinyin": "Wǒmen xūyào suànfǎ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý thuật toán."
    },
    {
      "word": "算法分析",
      "pinyin": "suànfǎ fēnxī",
      "meaning": "phân tích thuật toán",
      "example": "我们需要算法分析。",
      "examplePinyin": "Wǒmen xūyào suànfǎ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích thuật toán."
    },
    {
      "word": "算法检查",
      "pinyin": "suànfǎ jiǎnchá",
      "meaning": "kiểm tra thuật toán",
      "example": "我们需要算法检查。",
      "examplePinyin": "Wǒmen xūyào suànfǎ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra thuật toán."
    },
    {
      "word": "算法记录",
      "pinyin": "suànfǎ jìlù",
      "meaning": "ghi chép thuật toán",
      "example": "我们需要算法记录。",
      "examplePinyin": "Wǒmen xūyào suànfǎ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép thuật toán."
    },
    {
      "word": "算法设置",
      "pinyin": "suànfǎ shèzhì",
      "meaning": "cài đặt thuật toán",
      "example": "我们需要算法设置。",
      "examplePinyin": "Wǒmen xūyào suànfǎ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt thuật toán."
    },
    {
      "word": "算法更新",
      "pinyin": "suànfǎ gēngxīn",
      "meaning": "cập nhật thuật toán",
      "example": "我们需要算法更新。",
      "examplePinyin": "Wǒmen xūyào suànfǎ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật thuật toán."
    },
    {
      "word": "算法优化",
      "pinyin": "suànfǎ yōuhuà",
      "meaning": "tối ưu hóa thuật toán",
      "example": "我们需要算法优化。",
      "examplePinyin": "Wǒmen xūyào suànfǎ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa thuật toán."
    },
    {
      "word": "算法导入",
      "pinyin": "suànfǎ dǎorù",
      "meaning": "nhập vào thuật toán",
      "example": "我们需要算法导入。",
      "examplePinyin": "Wǒmen xūyào suànfǎ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào thuật toán."
    },
    {
      "word": "算法导出",
      "pinyin": "suànfǎ dǎochū",
      "meaning": "xuất ra thuật toán",
      "example": "我们需要算法导出。",
      "examplePinyin": "Wǒmen xūyào suànfǎ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra thuật toán."
    }
  ],
  "chuyen_nganh_van_phong": [
    {
      "word": "员工管理",
      "pinyin": "yuángōng guǎnlǐ",
      "meaning": "quản lý nhân viên",
      "example": "我们需要员工管理。",
      "examplePinyin": "Wǒmen xūyào yuángōng guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý nhân viên."
    },
    {
      "word": "员工处理",
      "pinyin": "yuángōng chǔlǐ",
      "meaning": "xử lý nhân viên",
      "example": "我们需要员工处理。",
      "examplePinyin": "Wǒmen xūyào yuángōng chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý nhân viên."
    },
    {
      "word": "员工分析",
      "pinyin": "yuángōng fēnxī",
      "meaning": "phân tích nhân viên",
      "example": "我们需要员工分析。",
      "examplePinyin": "Wǒmen xūyào yuángōng fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích nhân viên."
    },
    {
      "word": "员工检查",
      "pinyin": "yuángōng jiǎnchá",
      "meaning": "kiểm tra nhân viên",
      "example": "我们需要员工检查。",
      "examplePinyin": "Wǒmen xūyào yuángōng jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra nhân viên."
    },
    {
      "word": "员工记录",
      "pinyin": "yuángōng jìlù",
      "meaning": "ghi chép nhân viên",
      "example": "我们需要员工记录。",
      "examplePinyin": "Wǒmen xūyào yuángōng jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép nhân viên."
    },
    {
      "word": "员工设置",
      "pinyin": "yuángōng shèzhì",
      "meaning": "cài đặt nhân viên",
      "example": "我们需要员工设置。",
      "examplePinyin": "Wǒmen xūyào yuángōng shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt nhân viên."
    },
    {
      "word": "员工更新",
      "pinyin": "yuángōng gēngxīn",
      "meaning": "cập nhật nhân viên",
      "example": "我们需要员工更新。",
      "examplePinyin": "Wǒmen xūyào yuángōng gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật nhân viên."
    },
    {
      "word": "员工优化",
      "pinyin": "yuángōng yōuhuà",
      "meaning": "tối ưu hóa nhân viên",
      "example": "我们需要员工优化。",
      "examplePinyin": "Wǒmen xūyào yuángōng yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa nhân viên."
    },
    {
      "word": "员工导入",
      "pinyin": "yuángōng dǎorù",
      "meaning": "nhập vào nhân viên",
      "example": "我们需要员工导入。",
      "examplePinyin": "Wǒmen xūyào yuángōng dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào nhân viên."
    },
    {
      "word": "员工导出",
      "pinyin": "yuángōng dǎochū",
      "meaning": "xuất ra nhân viên",
      "example": "我们需要员工导出。",
      "examplePinyin": "Wǒmen xūyào yuángōng dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra nhân viên."
    },
    {
      "word": "员工备份",
      "pinyin": "yuángōng bèifèn",
      "meaning": "sao lưu nhân viên",
      "example": "我们需要员工备份。",
      "examplePinyin": "Wǒmen xūyào yuángōng bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu nhân viên."
    },
    {
      "word": "员工同步",
      "pinyin": "yuángōng tóngbù",
      "meaning": "đồng bộ nhân viên",
      "example": "我们需要员工同步。",
      "examplePinyin": "Wǒmen xūyào yuángōng tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ nhân viên."
    },
    {
      "word": "员工搜索",
      "pinyin": "yuángōng sōusuǒ",
      "meaning": "tìm kiếm nhân viên",
      "example": "我们需要员工搜索。",
      "examplePinyin": "Wǒmen xūyào yuángōng sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm nhân viên."
    },
    {
      "word": "员工分类",
      "pinyin": "yuángōng fēnlèi",
      "meaning": "phân loại nhân viên",
      "example": "我们需要员工分类。",
      "examplePinyin": "Wǒmen xūyào yuángōng fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại nhân viên."
    },
    {
      "word": "员工统计",
      "pinyin": "yuángōng tǒngjì",
      "meaning": "thống kê nhân viên",
      "example": "我们需要员工统计。",
      "examplePinyin": "Wǒmen xūyào yuángōng tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê nhân viên."
    },
    {
      "word": "员工确认",
      "pinyin": "yuángōng quèrèn",
      "meaning": "xác nhận nhân viên",
      "example": "我们需要员工确认。",
      "examplePinyin": "Wǒmen xūyào yuángōng quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận nhân viên."
    },
    {
      "word": "员工审核",
      "pinyin": "yuángōng shěnhé",
      "meaning": "duyệt/kiểm duyệt nhân viên",
      "example": "我们需要员工审核。",
      "examplePinyin": "Wǒmen xūyào yuángōng shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt nhân viên."
    },
    {
      "word": "员工测试",
      "pinyin": "yuángōng cèshì",
      "meaning": "kiểm thử nhân viên",
      "example": "我们需要员工测试。",
      "examplePinyin": "Wǒmen xūyào yuángōng cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử nhân viên."
    },
    {
      "word": "员工维护",
      "pinyin": "yuángōng wéihù",
      "meaning": "bảo trì nhân viên",
      "example": "我们需要员工维护。",
      "examplePinyin": "Wǒmen xūyào yuángōng wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì nhân viên."
    },
    {
      "word": "员工设计",
      "pinyin": "yuángōng shèjì",
      "meaning": "thiết kế nhân viên",
      "example": "我们需要员工设计。",
      "examplePinyin": "Wǒmen xūyào yuángōng shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế nhân viên."
    },
    {
      "word": "员工开发",
      "pinyin": "yuángōng kāifā",
      "meaning": "phát triển nhân viên",
      "example": "我们需要员工开发。",
      "examplePinyin": "Wǒmen xūyào yuángōng kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển nhân viên."
    },
    {
      "word": "员工训练",
      "pinyin": "yuángōng xùnliàn",
      "meaning": "huấn luyện nhân viên",
      "example": "我们需要员工训练。",
      "examplePinyin": "Wǒmen xūyào yuángōng xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện nhân viên."
    },
    {
      "word": "员工识别",
      "pinyin": "yuángōng shíbié",
      "meaning": "nhận dạng nhân viên",
      "example": "我们需要员工识别。",
      "examplePinyin": "Wǒmen xūyào yuángōng shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng nhân viên."
    },
    {
      "word": "员工生成",
      "pinyin": "yuángōng shēngchéng",
      "meaning": "tạo sinh nhân viên",
      "example": "我们需要员工生成。",
      "examplePinyin": "Wǒmen xūyào yuángōng shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh nhân viên."
    },
    {
      "word": "员工通知",
      "pinyin": "yuángōng tōngzhī",
      "meaning": "thông báo nhân viên",
      "example": "我们需要员工通知。",
      "examplePinyin": "Wǒmen xūyào yuángōng tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo nhân viên."
    },
    {
      "word": "员工权限",
      "pinyin": "yuángōng quánxiàn",
      "meaning": "quyền hạn nhân viên",
      "example": "我们需要员工权限。",
      "examplePinyin": "Wǒmen xūyào yuángōng quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn nhân viên."
    },
    {
      "word": "员工状态",
      "pinyin": "yuángōng zhuàngtài",
      "meaning": "trạng thái nhân viên",
      "example": "我们需要员工状态。",
      "examplePinyin": "Wǒmen xūyào yuángōng zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái nhân viên."
    },
    {
      "word": "员工编号",
      "pinyin": "yuángōng biānhào",
      "meaning": "mã số nhân viên",
      "example": "我们需要员工编号。",
      "examplePinyin": "Wǒmen xūyào yuángōng biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số nhân viên."
    },
    {
      "word": "员工模板",
      "pinyin": "yuángōng múbǎn",
      "meaning": "mẫu/template nhân viên",
      "example": "我们需要员工模板。",
      "examplePinyin": "Wǒmen xūyào yuángōng múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template nhân viên."
    },
    {
      "word": "员工异常",
      "pinyin": "yuángōng yìcháng",
      "meaning": "bất thường/lỗi nhân viên",
      "example": "我们需要员工异常。",
      "examplePinyin": "Wǒmen xūyào yuángōng yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi nhân viên."
    },
    {
      "word": "经理管理",
      "pinyin": "jīnglǐ guǎnlǐ",
      "meaning": "quản lý quản lý",
      "example": "我们需要经理管理。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý quản lý."
    },
    {
      "word": "经理处理",
      "pinyin": "jīnglǐ chǔlǐ",
      "meaning": "xử lý quản lý",
      "example": "我们需要经理处理。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý quản lý."
    },
    {
      "word": "经理分析",
      "pinyin": "jīnglǐ fēnxī",
      "meaning": "phân tích quản lý",
      "example": "我们需要经理分析。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích quản lý."
    },
    {
      "word": "经理检查",
      "pinyin": "jīnglǐ jiǎnchá",
      "meaning": "kiểm tra quản lý",
      "example": "我们需要经理检查。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra quản lý."
    },
    {
      "word": "经理记录",
      "pinyin": "jīnglǐ jìlù",
      "meaning": "ghi chép quản lý",
      "example": "我们需要经理记录。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép quản lý."
    },
    {
      "word": "经理设置",
      "pinyin": "jīnglǐ shèzhì",
      "meaning": "cài đặt quản lý",
      "example": "我们需要经理设置。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt quản lý."
    },
    {
      "word": "经理更新",
      "pinyin": "jīnglǐ gēngxīn",
      "meaning": "cập nhật quản lý",
      "example": "我们需要经理更新。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật quản lý."
    },
    {
      "word": "经理优化",
      "pinyin": "jīnglǐ yōuhuà",
      "meaning": "tối ưu hóa quản lý",
      "example": "我们需要经理优化。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa quản lý."
    },
    {
      "word": "经理导入",
      "pinyin": "jīnglǐ dǎorù",
      "meaning": "nhập vào quản lý",
      "example": "我们需要经理导入。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào quản lý."
    },
    {
      "word": "经理导出",
      "pinyin": "jīnglǐ dǎochū",
      "meaning": "xuất ra quản lý",
      "example": "我们需要经理导出。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra quản lý."
    },
    {
      "word": "经理备份",
      "pinyin": "jīnglǐ bèifèn",
      "meaning": "sao lưu quản lý",
      "example": "我们需要经理备份。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu quản lý."
    },
    {
      "word": "经理同步",
      "pinyin": "jīnglǐ tóngbù",
      "meaning": "đồng bộ quản lý",
      "example": "我们需要经理同步。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ quản lý."
    },
    {
      "word": "经理搜索",
      "pinyin": "jīnglǐ sōusuǒ",
      "meaning": "tìm kiếm quản lý",
      "example": "我们需要经理搜索。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm quản lý."
    },
    {
      "word": "经理分类",
      "pinyin": "jīnglǐ fēnlèi",
      "meaning": "phân loại quản lý",
      "example": "我们需要经理分类。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại quản lý."
    },
    {
      "word": "经理统计",
      "pinyin": "jīnglǐ tǒngjì",
      "meaning": "thống kê quản lý",
      "example": "我们需要经理统计。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê quản lý."
    },
    {
      "word": "经理确认",
      "pinyin": "jīnglǐ quèrèn",
      "meaning": "xác nhận quản lý",
      "example": "我们需要经理确认。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận quản lý."
    },
    {
      "word": "经理审核",
      "pinyin": "jīnglǐ shěnhé",
      "meaning": "duyệt/kiểm duyệt quản lý",
      "example": "我们需要经理审核。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt quản lý."
    },
    {
      "word": "经理测试",
      "pinyin": "jīnglǐ cèshì",
      "meaning": "kiểm thử quản lý",
      "example": "我们需要经理测试。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử quản lý."
    },
    {
      "word": "经理维护",
      "pinyin": "jīnglǐ wéihù",
      "meaning": "bảo trì quản lý",
      "example": "我们需要经理维护。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì quản lý."
    },
    {
      "word": "经理设计",
      "pinyin": "jīnglǐ shèjì",
      "meaning": "thiết kế quản lý",
      "example": "我们需要经理设计。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế quản lý."
    },
    {
      "word": "经理开发",
      "pinyin": "jīnglǐ kāifā",
      "meaning": "phát triển quản lý",
      "example": "我们需要经理开发。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển quản lý."
    },
    {
      "word": "经理训练",
      "pinyin": "jīnglǐ xùnliàn",
      "meaning": "huấn luyện quản lý",
      "example": "我们需要经理训练。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện quản lý."
    },
    {
      "word": "经理识别",
      "pinyin": "jīnglǐ shíbié",
      "meaning": "nhận dạng quản lý",
      "example": "我们需要经理识别。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng quản lý."
    },
    {
      "word": "经理生成",
      "pinyin": "jīnglǐ shēngchéng",
      "meaning": "tạo sinh quản lý",
      "example": "我们需要经理生成。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh quản lý."
    },
    {
      "word": "经理通知",
      "pinyin": "jīnglǐ tōngzhī",
      "meaning": "thông báo quản lý",
      "example": "我们需要经理通知。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo quản lý."
    },
    {
      "word": "经理权限",
      "pinyin": "jīnglǐ quánxiàn",
      "meaning": "quyền hạn quản lý",
      "example": "我们需要经理权限。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn quản lý."
    },
    {
      "word": "经理状态",
      "pinyin": "jīnglǐ zhuàngtài",
      "meaning": "trạng thái quản lý",
      "example": "我们需要经理状态。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái quản lý."
    },
    {
      "word": "经理编号",
      "pinyin": "jīnglǐ biānhào",
      "meaning": "mã số quản lý",
      "example": "我们需要经理编号。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số quản lý."
    },
    {
      "word": "经理模板",
      "pinyin": "jīnglǐ múbǎn",
      "meaning": "mẫu/template quản lý",
      "example": "我们需要经理模板。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template quản lý."
    },
    {
      "word": "经理异常",
      "pinyin": "jīnglǐ yìcháng",
      "meaning": "bất thường/lỗi quản lý",
      "example": "我们需要经理异常。",
      "examplePinyin": "Wǒmen xūyào jīnglǐ yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi quản lý."
    },
    {
      "word": "会议管理",
      "pinyin": "huìyì guǎnlǐ",
      "meaning": "quản lý cuộc họp",
      "example": "我们需要会议管理。",
      "examplePinyin": "Wǒmen xūyào huìyì guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý cuộc họp."
    },
    {
      "word": "会议处理",
      "pinyin": "huìyì chǔlǐ",
      "meaning": "xử lý cuộc họp",
      "example": "我们需要会议处理。",
      "examplePinyin": "Wǒmen xūyào huìyì chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý cuộc họp."
    },
    {
      "word": "会议分析",
      "pinyin": "huìyì fēnxī",
      "meaning": "phân tích cuộc họp",
      "example": "我们需要会议分析。",
      "examplePinyin": "Wǒmen xūyào huìyì fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích cuộc họp."
    },
    {
      "word": "会议检查",
      "pinyin": "huìyì jiǎnchá",
      "meaning": "kiểm tra cuộc họp",
      "example": "我们需要会议检查。",
      "examplePinyin": "Wǒmen xūyào huìyì jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra cuộc họp."
    },
    {
      "word": "会议记录",
      "pinyin": "huìyì jìlù",
      "meaning": "ghi chép cuộc họp",
      "example": "我们需要会议记录。",
      "examplePinyin": "Wǒmen xūyào huìyì jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép cuộc họp."
    },
    {
      "word": "会议设置",
      "pinyin": "huìyì shèzhì",
      "meaning": "cài đặt cuộc họp",
      "example": "我们需要会议设置。",
      "examplePinyin": "Wǒmen xūyào huìyì shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt cuộc họp."
    },
    {
      "word": "会议更新",
      "pinyin": "huìyì gēngxīn",
      "meaning": "cập nhật cuộc họp",
      "example": "我们需要会议更新。",
      "examplePinyin": "Wǒmen xūyào huìyì gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật cuộc họp."
    },
    {
      "word": "会议优化",
      "pinyin": "huìyì yōuhuà",
      "meaning": "tối ưu hóa cuộc họp",
      "example": "我们需要会议优化。",
      "examplePinyin": "Wǒmen xūyào huìyì yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa cuộc họp."
    },
    {
      "word": "会议导入",
      "pinyin": "huìyì dǎorù",
      "meaning": "nhập vào cuộc họp",
      "example": "我们需要会议导入。",
      "examplePinyin": "Wǒmen xūyào huìyì dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào cuộc họp."
    },
    {
      "word": "会议导出",
      "pinyin": "huìyì dǎochū",
      "meaning": "xuất ra cuộc họp",
      "example": "我们需要会议导出。",
      "examplePinyin": "Wǒmen xūyào huìyì dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra cuộc họp."
    },
    {
      "word": "会议备份",
      "pinyin": "huìyì bèifèn",
      "meaning": "sao lưu cuộc họp",
      "example": "我们需要会议备份。",
      "examplePinyin": "Wǒmen xūyào huìyì bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu cuộc họp."
    },
    {
      "word": "会议同步",
      "pinyin": "huìyì tóngbù",
      "meaning": "đồng bộ cuộc họp",
      "example": "我们需要会议同步。",
      "examplePinyin": "Wǒmen xūyào huìyì tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ cuộc họp."
    },
    {
      "word": "会议搜索",
      "pinyin": "huìyì sōusuǒ",
      "meaning": "tìm kiếm cuộc họp",
      "example": "我们需要会议搜索。",
      "examplePinyin": "Wǒmen xūyào huìyì sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm cuộc họp."
    },
    {
      "word": "会议分类",
      "pinyin": "huìyì fēnlèi",
      "meaning": "phân loại cuộc họp",
      "example": "我们需要会议分类。",
      "examplePinyin": "Wǒmen xūyào huìyì fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại cuộc họp."
    },
    {
      "word": "会议统计",
      "pinyin": "huìyì tǒngjì",
      "meaning": "thống kê cuộc họp",
      "example": "我们需要会议统计。",
      "examplePinyin": "Wǒmen xūyào huìyì tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê cuộc họp."
    },
    {
      "word": "会议确认",
      "pinyin": "huìyì quèrèn",
      "meaning": "xác nhận cuộc họp",
      "example": "我们需要会议确认。",
      "examplePinyin": "Wǒmen xūyào huìyì quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận cuộc họp."
    },
    {
      "word": "会议审核",
      "pinyin": "huìyì shěnhé",
      "meaning": "duyệt/kiểm duyệt cuộc họp",
      "example": "我们需要会议审核。",
      "examplePinyin": "Wǒmen xūyào huìyì shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt cuộc họp."
    },
    {
      "word": "会议测试",
      "pinyin": "huìyì cèshì",
      "meaning": "kiểm thử cuộc họp",
      "example": "我们需要会议测试。",
      "examplePinyin": "Wǒmen xūyào huìyì cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử cuộc họp."
    },
    {
      "word": "会议维护",
      "pinyin": "huìyì wéihù",
      "meaning": "bảo trì cuộc họp",
      "example": "我们需要会议维护。",
      "examplePinyin": "Wǒmen xūyào huìyì wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì cuộc họp."
    },
    {
      "word": "会议设计",
      "pinyin": "huìyì shèjì",
      "meaning": "thiết kế cuộc họp",
      "example": "我们需要会议设计。",
      "examplePinyin": "Wǒmen xūyào huìyì shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế cuộc họp."
    },
    {
      "word": "会议开发",
      "pinyin": "huìyì kāifā",
      "meaning": "phát triển cuộc họp",
      "example": "我们需要会议开发。",
      "examplePinyin": "Wǒmen xūyào huìyì kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển cuộc họp."
    },
    {
      "word": "会议训练",
      "pinyin": "huìyì xùnliàn",
      "meaning": "huấn luyện cuộc họp",
      "example": "我们需要会议训练。",
      "examplePinyin": "Wǒmen xūyào huìyì xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện cuộc họp."
    },
    {
      "word": "会议识别",
      "pinyin": "huìyì shíbié",
      "meaning": "nhận dạng cuộc họp",
      "example": "我们需要会议识别。",
      "examplePinyin": "Wǒmen xūyào huìyì shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng cuộc họp."
    },
    {
      "word": "会议生成",
      "pinyin": "huìyì shēngchéng",
      "meaning": "tạo sinh cuộc họp",
      "example": "我们需要会议生成。",
      "examplePinyin": "Wǒmen xūyào huìyì shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh cuộc họp."
    },
    {
      "word": "会议通知",
      "pinyin": "huìyì tōngzhī",
      "meaning": "thông báo cuộc họp",
      "example": "我们需要会议通知。",
      "examplePinyin": "Wǒmen xūyào huìyì tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo cuộc họp."
    },
    {
      "word": "会议权限",
      "pinyin": "huìyì quánxiàn",
      "meaning": "quyền hạn cuộc họp",
      "example": "我们需要会议权限。",
      "examplePinyin": "Wǒmen xūyào huìyì quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn cuộc họp."
    },
    {
      "word": "会议状态",
      "pinyin": "huìyì zhuàngtài",
      "meaning": "trạng thái cuộc họp",
      "example": "我们需要会议状态。",
      "examplePinyin": "Wǒmen xūyào huìyì zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái cuộc họp."
    },
    {
      "word": "会议编号",
      "pinyin": "huìyì biānhào",
      "meaning": "mã số cuộc họp",
      "example": "我们需要会议编号。",
      "examplePinyin": "Wǒmen xūyào huìyì biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số cuộc họp."
    },
    {
      "word": "会议模板",
      "pinyin": "huìyì múbǎn",
      "meaning": "mẫu/template cuộc họp",
      "example": "我们需要会议模板。",
      "examplePinyin": "Wǒmen xūyào huìyì múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template cuộc họp."
    },
    {
      "word": "会议异常",
      "pinyin": "huìyì yìcháng",
      "meaning": "bất thường/lỗi cuộc họp",
      "example": "我们需要会议异常。",
      "examplePinyin": "Wǒmen xūyào huìyì yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi cuộc họp."
    },
    {
      "word": "合同管理",
      "pinyin": "hétong guǎnlǐ",
      "meaning": "quản lý hợp đồng",
      "example": "我们需要合同管理。",
      "examplePinyin": "Wǒmen xūyào hétong guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý hợp đồng."
    },
    {
      "word": "合同处理",
      "pinyin": "hétong chǔlǐ",
      "meaning": "xử lý hợp đồng",
      "example": "我们需要合同处理。",
      "examplePinyin": "Wǒmen xūyào hétong chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý hợp đồng."
    },
    {
      "word": "合同分析",
      "pinyin": "hétong fēnxī",
      "meaning": "phân tích hợp đồng",
      "example": "我们需要合同分析。",
      "examplePinyin": "Wǒmen xūyào hétong fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích hợp đồng."
    },
    {
      "word": "合同检查",
      "pinyin": "hétong jiǎnchá",
      "meaning": "kiểm tra hợp đồng",
      "example": "我们需要合同检查。",
      "examplePinyin": "Wǒmen xūyào hétong jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra hợp đồng."
    },
    {
      "word": "合同记录",
      "pinyin": "hétong jìlù",
      "meaning": "ghi chép hợp đồng",
      "example": "我们需要合同记录。",
      "examplePinyin": "Wǒmen xūyào hétong jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép hợp đồng."
    },
    {
      "word": "合同设置",
      "pinyin": "hétong shèzhì",
      "meaning": "cài đặt hợp đồng",
      "example": "我们需要合同设置。",
      "examplePinyin": "Wǒmen xūyào hétong shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt hợp đồng."
    },
    {
      "word": "合同更新",
      "pinyin": "hétong gēngxīn",
      "meaning": "cập nhật hợp đồng",
      "example": "我们需要合同更新。",
      "examplePinyin": "Wǒmen xūyào hétong gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật hợp đồng."
    },
    {
      "word": "合同优化",
      "pinyin": "hétong yōuhuà",
      "meaning": "tối ưu hóa hợp đồng",
      "example": "我们需要合同优化。",
      "examplePinyin": "Wǒmen xūyào hétong yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa hợp đồng."
    },
    {
      "word": "合同导入",
      "pinyin": "hétong dǎorù",
      "meaning": "nhập vào hợp đồng",
      "example": "我们需要合同导入。",
      "examplePinyin": "Wǒmen xūyào hétong dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào hợp đồng."
    },
    {
      "word": "合同导出",
      "pinyin": "hétong dǎochū",
      "meaning": "xuất ra hợp đồng",
      "example": "我们需要合同导出。",
      "examplePinyin": "Wǒmen xūyào hétong dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra hợp đồng."
    },
    {
      "word": "合同备份",
      "pinyin": "hétong bèifèn",
      "meaning": "sao lưu hợp đồng",
      "example": "我们需要合同备份。",
      "examplePinyin": "Wǒmen xūyào hétong bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu hợp đồng."
    },
    {
      "word": "合同同步",
      "pinyin": "hétong tóngbù",
      "meaning": "đồng bộ hợp đồng",
      "example": "我们需要合同同步。",
      "examplePinyin": "Wǒmen xūyào hétong tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ hợp đồng."
    },
    {
      "word": "合同搜索",
      "pinyin": "hétong sōusuǒ",
      "meaning": "tìm kiếm hợp đồng",
      "example": "我们需要合同搜索。",
      "examplePinyin": "Wǒmen xūyào hétong sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm hợp đồng."
    },
    {
      "word": "合同分类",
      "pinyin": "hétong fēnlèi",
      "meaning": "phân loại hợp đồng",
      "example": "我们需要合同分类。",
      "examplePinyin": "Wǒmen xūyào hétong fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại hợp đồng."
    },
    {
      "word": "合同统计",
      "pinyin": "hétong tǒngjì",
      "meaning": "thống kê hợp đồng",
      "example": "我们需要合同统计。",
      "examplePinyin": "Wǒmen xūyào hétong tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê hợp đồng."
    },
    {
      "word": "合同确认",
      "pinyin": "hétong quèrèn",
      "meaning": "xác nhận hợp đồng",
      "example": "我们需要合同确认。",
      "examplePinyin": "Wǒmen xūyào hétong quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận hợp đồng."
    },
    {
      "word": "合同审核",
      "pinyin": "hétong shěnhé",
      "meaning": "duyệt/kiểm duyệt hợp đồng",
      "example": "我们需要合同审核。",
      "examplePinyin": "Wǒmen xūyào hétong shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt hợp đồng."
    },
    {
      "word": "合同测试",
      "pinyin": "hétong cèshì",
      "meaning": "kiểm thử hợp đồng",
      "example": "我们需要合同测试。",
      "examplePinyin": "Wǒmen xūyào hétong cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử hợp đồng."
    },
    {
      "word": "合同维护",
      "pinyin": "hétong wéihù",
      "meaning": "bảo trì hợp đồng",
      "example": "我们需要合同维护。",
      "examplePinyin": "Wǒmen xūyào hétong wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì hợp đồng."
    },
    {
      "word": "合同设计",
      "pinyin": "hétong shèjì",
      "meaning": "thiết kế hợp đồng",
      "example": "我们需要合同设计。",
      "examplePinyin": "Wǒmen xūyào hétong shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế hợp đồng."
    },
    {
      "word": "合同开发",
      "pinyin": "hétong kāifā",
      "meaning": "phát triển hợp đồng",
      "example": "我们需要合同开发。",
      "examplePinyin": "Wǒmen xūyào hétong kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển hợp đồng."
    },
    {
      "word": "合同训练",
      "pinyin": "hétong xùnliàn",
      "meaning": "huấn luyện hợp đồng",
      "example": "我们需要合同训练。",
      "examplePinyin": "Wǒmen xūyào hétong xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện hợp đồng."
    },
    {
      "word": "合同识别",
      "pinyin": "hétong shíbié",
      "meaning": "nhận dạng hợp đồng",
      "example": "我们需要合同识别。",
      "examplePinyin": "Wǒmen xūyào hétong shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng hợp đồng."
    },
    {
      "word": "合同生成",
      "pinyin": "hétong shēngchéng",
      "meaning": "tạo sinh hợp đồng",
      "example": "我们需要合同生成。",
      "examplePinyin": "Wǒmen xūyào hétong shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh hợp đồng."
    },
    {
      "word": "合同通知",
      "pinyin": "hétong tōngzhī",
      "meaning": "thông báo hợp đồng",
      "example": "我们需要合同通知。",
      "examplePinyin": "Wǒmen xūyào hétong tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo hợp đồng."
    },
    {
      "word": "合同权限",
      "pinyin": "hétong quánxiàn",
      "meaning": "quyền hạn hợp đồng",
      "example": "我们需要合同权限。",
      "examplePinyin": "Wǒmen xūyào hétong quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn hợp đồng."
    },
    {
      "word": "合同状态",
      "pinyin": "hétong zhuàngtài",
      "meaning": "trạng thái hợp đồng",
      "example": "我们需要合同状态。",
      "examplePinyin": "Wǒmen xūyào hétong zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái hợp đồng."
    },
    {
      "word": "合同编号",
      "pinyin": "hétong biānhào",
      "meaning": "mã số hợp đồng",
      "example": "我们需要合同编号。",
      "examplePinyin": "Wǒmen xūyào hétong biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số hợp đồng."
    },
    {
      "word": "合同模板",
      "pinyin": "hétong múbǎn",
      "meaning": "mẫu/template hợp đồng",
      "example": "我们需要合同模板。",
      "examplePinyin": "Wǒmen xūyào hétong múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template hợp đồng."
    },
    {
      "word": "合同异常",
      "pinyin": "hétong yìcháng",
      "meaning": "bất thường/lỗi hợp đồng",
      "example": "我们需要合同异常。",
      "examplePinyin": "Wǒmen xūyào hétong yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi hợp đồng."
    },
    {
      "word": "工资管理",
      "pinyin": "gōngzī guǎnlǐ",
      "meaning": "quản lý lương",
      "example": "我们需要工资管理。",
      "examplePinyin": "Wǒmen xūyào gōngzī guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý lương."
    },
    {
      "word": "工资处理",
      "pinyin": "gōngzī chǔlǐ",
      "meaning": "xử lý lương",
      "example": "我们需要工资处理。",
      "examplePinyin": "Wǒmen xūyào gōngzī chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý lương."
    },
    {
      "word": "工资分析",
      "pinyin": "gōngzī fēnxī",
      "meaning": "phân tích lương",
      "example": "我们需要工资分析。",
      "examplePinyin": "Wǒmen xūyào gōngzī fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích lương."
    },
    {
      "word": "工资检查",
      "pinyin": "gōngzī jiǎnchá",
      "meaning": "kiểm tra lương",
      "example": "我们需要工资检查。",
      "examplePinyin": "Wǒmen xūyào gōngzī jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra lương."
    },
    {
      "word": "工资记录",
      "pinyin": "gōngzī jìlù",
      "meaning": "ghi chép lương",
      "example": "我们需要工资记录。",
      "examplePinyin": "Wǒmen xūyào gōngzī jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép lương."
    },
    {
      "word": "工资设置",
      "pinyin": "gōngzī shèzhì",
      "meaning": "cài đặt lương",
      "example": "我们需要工资设置。",
      "examplePinyin": "Wǒmen xūyào gōngzī shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt lương."
    },
    {
      "word": "工资更新",
      "pinyin": "gōngzī gēngxīn",
      "meaning": "cập nhật lương",
      "example": "我们需要工资更新。",
      "examplePinyin": "Wǒmen xūyào gōngzī gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật lương."
    },
    {
      "word": "工资优化",
      "pinyin": "gōngzī yōuhuà",
      "meaning": "tối ưu hóa lương",
      "example": "我们需要工资优化。",
      "examplePinyin": "Wǒmen xūyào gōngzī yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa lương."
    },
    {
      "word": "工资导入",
      "pinyin": "gōngzī dǎorù",
      "meaning": "nhập vào lương",
      "example": "我们需要工资导入。",
      "examplePinyin": "Wǒmen xūyào gōngzī dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào lương."
    },
    {
      "word": "工资导出",
      "pinyin": "gōngzī dǎochū",
      "meaning": "xuất ra lương",
      "example": "我们需要工资导出。",
      "examplePinyin": "Wǒmen xūyào gōngzī dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra lương."
    },
    {
      "word": "工资备份",
      "pinyin": "gōngzī bèifèn",
      "meaning": "sao lưu lương",
      "example": "我们需要工资备份。",
      "examplePinyin": "Wǒmen xūyào gōngzī bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu lương."
    },
    {
      "word": "工资同步",
      "pinyin": "gōngzī tóngbù",
      "meaning": "đồng bộ lương",
      "example": "我们需要工资同步。",
      "examplePinyin": "Wǒmen xūyào gōngzī tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ lương."
    },
    {
      "word": "工资搜索",
      "pinyin": "gōngzī sōusuǒ",
      "meaning": "tìm kiếm lương",
      "example": "我们需要工资搜索。",
      "examplePinyin": "Wǒmen xūyào gōngzī sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm lương."
    },
    {
      "word": "工资分类",
      "pinyin": "gōngzī fēnlèi",
      "meaning": "phân loại lương",
      "example": "我们需要工资分类。",
      "examplePinyin": "Wǒmen xūyào gōngzī fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại lương."
    },
    {
      "word": "工资统计",
      "pinyin": "gōngzī tǒngjì",
      "meaning": "thống kê lương",
      "example": "我们需要工资统计。",
      "examplePinyin": "Wǒmen xūyào gōngzī tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê lương."
    },
    {
      "word": "工资确认",
      "pinyin": "gōngzī quèrèn",
      "meaning": "xác nhận lương",
      "example": "我们需要工资确认。",
      "examplePinyin": "Wǒmen xūyào gōngzī quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận lương."
    },
    {
      "word": "工资审核",
      "pinyin": "gōngzī shěnhé",
      "meaning": "duyệt/kiểm duyệt lương",
      "example": "我们需要工资审核。",
      "examplePinyin": "Wǒmen xūyào gōngzī shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt lương."
    },
    {
      "word": "工资测试",
      "pinyin": "gōngzī cèshì",
      "meaning": "kiểm thử lương",
      "example": "我们需要工资测试。",
      "examplePinyin": "Wǒmen xūyào gōngzī cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử lương."
    },
    {
      "word": "工资维护",
      "pinyin": "gōngzī wéihù",
      "meaning": "bảo trì lương",
      "example": "我们需要工资维护。",
      "examplePinyin": "Wǒmen xūyào gōngzī wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì lương."
    },
    {
      "word": "工资设计",
      "pinyin": "gōngzī shèjì",
      "meaning": "thiết kế lương",
      "example": "我们需要工资设计。",
      "examplePinyin": "Wǒmen xūyào gōngzī shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế lương."
    },
    {
      "word": "工资开发",
      "pinyin": "gōngzī kāifā",
      "meaning": "phát triển lương",
      "example": "我们需要工资开发。",
      "examplePinyin": "Wǒmen xūyào gōngzī kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển lương."
    },
    {
      "word": "工资训练",
      "pinyin": "gōngzī xùnliàn",
      "meaning": "huấn luyện lương",
      "example": "我们需要工资训练。",
      "examplePinyin": "Wǒmen xūyào gōngzī xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện lương."
    },
    {
      "word": "工资识别",
      "pinyin": "gōngzī shíbié",
      "meaning": "nhận dạng lương",
      "example": "我们需要工资识别。",
      "examplePinyin": "Wǒmen xūyào gōngzī shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng lương."
    },
    {
      "word": "工资生成",
      "pinyin": "gōngzī shēngchéng",
      "meaning": "tạo sinh lương",
      "example": "我们需要工资生成。",
      "examplePinyin": "Wǒmen xūyào gōngzī shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh lương."
    },
    {
      "word": "工资通知",
      "pinyin": "gōngzī tōngzhī",
      "meaning": "thông báo lương",
      "example": "我们需要工资通知。",
      "examplePinyin": "Wǒmen xūyào gōngzī tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo lương."
    },
    {
      "word": "工资权限",
      "pinyin": "gōngzī quánxiàn",
      "meaning": "quyền hạn lương",
      "example": "我们需要工资权限。",
      "examplePinyin": "Wǒmen xūyào gōngzī quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn lương."
    },
    {
      "word": "工资状态",
      "pinyin": "gōngzī zhuàngtài",
      "meaning": "trạng thái lương",
      "example": "我们需要工资状态。",
      "examplePinyin": "Wǒmen xūyào gōngzī zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái lương."
    },
    {
      "word": "工资编号",
      "pinyin": "gōngzī biānhào",
      "meaning": "mã số lương",
      "example": "我们需要工资编号。",
      "examplePinyin": "Wǒmen xūyào gōngzī biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số lương."
    },
    {
      "word": "工资模板",
      "pinyin": "gōngzī múbǎn",
      "meaning": "mẫu/template lương",
      "example": "我们需要工资模板。",
      "examplePinyin": "Wǒmen xūyào gōngzī múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template lương."
    },
    {
      "word": "工资异常",
      "pinyin": "gōngzī yìcháng",
      "meaning": "bất thường/lỗi lương",
      "example": "我们需要工资异常。",
      "examplePinyin": "Wǒmen xūyào gōngzī yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi lương."
    },
    {
      "word": "项目管理",
      "pinyin": "xiàngmù guǎnlǐ",
      "meaning": "quản lý dự án",
      "example": "我们需要项目管理。",
      "examplePinyin": "Wǒmen xūyào xiàngmù guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý dự án."
    },
    {
      "word": "项目处理",
      "pinyin": "xiàngmù chǔlǐ",
      "meaning": "xử lý dự án",
      "example": "我们需要项目处理。",
      "examplePinyin": "Wǒmen xūyào xiàngmù chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý dự án."
    },
    {
      "word": "项目分析",
      "pinyin": "xiàngmù fēnxī",
      "meaning": "phân tích dự án",
      "example": "我们需要项目分析。",
      "examplePinyin": "Wǒmen xūyào xiàngmù fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích dự án."
    },
    {
      "word": "项目检查",
      "pinyin": "xiàngmù jiǎnchá",
      "meaning": "kiểm tra dự án",
      "example": "我们需要项目检查。",
      "examplePinyin": "Wǒmen xūyào xiàngmù jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra dự án."
    },
    {
      "word": "项目记录",
      "pinyin": "xiàngmù jìlù",
      "meaning": "ghi chép dự án",
      "example": "我们需要项目记录。",
      "examplePinyin": "Wǒmen xūyào xiàngmù jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép dự án."
    },
    {
      "word": "项目设置",
      "pinyin": "xiàngmù shèzhì",
      "meaning": "cài đặt dự án",
      "example": "我们需要项目设置。",
      "examplePinyin": "Wǒmen xūyào xiàngmù shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt dự án."
    },
    {
      "word": "项目更新",
      "pinyin": "xiàngmù gēngxīn",
      "meaning": "cập nhật dự án",
      "example": "我们需要项目更新。",
      "examplePinyin": "Wǒmen xūyào xiàngmù gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật dự án."
    },
    {
      "word": "项目优化",
      "pinyin": "xiàngmù yōuhuà",
      "meaning": "tối ưu hóa dự án",
      "example": "我们需要项目优化。",
      "examplePinyin": "Wǒmen xūyào xiàngmù yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa dự án."
    },
    {
      "word": "项目导入",
      "pinyin": "xiàngmù dǎorù",
      "meaning": "nhập vào dự án",
      "example": "我们需要项目导入。",
      "examplePinyin": "Wǒmen xūyào xiàngmù dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào dự án."
    },
    {
      "word": "项目导出",
      "pinyin": "xiàngmù dǎochū",
      "meaning": "xuất ra dự án",
      "example": "我们需要项目导出。",
      "examplePinyin": "Wǒmen xūyào xiàngmù dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra dự án."
    },
    {
      "word": "项目备份",
      "pinyin": "xiàngmù bèifèn",
      "meaning": "sao lưu dự án",
      "example": "我们需要项目备份。",
      "examplePinyin": "Wǒmen xūyào xiàngmù bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu dự án."
    },
    {
      "word": "项目同步",
      "pinyin": "xiàngmù tóngbù",
      "meaning": "đồng bộ dự án",
      "example": "我们需要项目同步。",
      "examplePinyin": "Wǒmen xūyào xiàngmù tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ dự án."
    },
    {
      "word": "项目搜索",
      "pinyin": "xiàngmù sōusuǒ",
      "meaning": "tìm kiếm dự án",
      "example": "我们需要项目搜索。",
      "examplePinyin": "Wǒmen xūyào xiàngmù sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm dự án."
    },
    {
      "word": "项目分类",
      "pinyin": "xiàngmù fēnlèi",
      "meaning": "phân loại dự án",
      "example": "我们需要项目分类。",
      "examplePinyin": "Wǒmen xūyào xiàngmù fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại dự án."
    },
    {
      "word": "项目统计",
      "pinyin": "xiàngmù tǒngjì",
      "meaning": "thống kê dự án",
      "example": "我们需要项目统计。",
      "examplePinyin": "Wǒmen xūyào xiàngmù tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê dự án."
    },
    {
      "word": "项目确认",
      "pinyin": "xiàngmù quèrèn",
      "meaning": "xác nhận dự án",
      "example": "我们需要项目确认。",
      "examplePinyin": "Wǒmen xūyào xiàngmù quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận dự án."
    },
    {
      "word": "项目审核",
      "pinyin": "xiàngmù shěnhé",
      "meaning": "duyệt/kiểm duyệt dự án",
      "example": "我们需要项目审核。",
      "examplePinyin": "Wǒmen xūyào xiàngmù shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt dự án."
    },
    {
      "word": "项目测试",
      "pinyin": "xiàngmù cèshì",
      "meaning": "kiểm thử dự án",
      "example": "我们需要项目测试。",
      "examplePinyin": "Wǒmen xūyào xiàngmù cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử dự án."
    },
    {
      "word": "项目维护",
      "pinyin": "xiàngmù wéihù",
      "meaning": "bảo trì dự án",
      "example": "我们需要项目维护。",
      "examplePinyin": "Wǒmen xūyào xiàngmù wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì dự án."
    },
    {
      "word": "项目设计",
      "pinyin": "xiàngmù shèjì",
      "meaning": "thiết kế dự án",
      "example": "我们需要项目设计。",
      "examplePinyin": "Wǒmen xūyào xiàngmù shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế dự án."
    },
    {
      "word": "项目开发",
      "pinyin": "xiàngmù kāifā",
      "meaning": "phát triển dự án",
      "example": "我们需要项目开发。",
      "examplePinyin": "Wǒmen xūyào xiàngmù kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển dự án."
    },
    {
      "word": "项目训练",
      "pinyin": "xiàngmù xùnliàn",
      "meaning": "huấn luyện dự án",
      "example": "我们需要项目训练。",
      "examplePinyin": "Wǒmen xūyào xiàngmù xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện dự án."
    },
    {
      "word": "项目识别",
      "pinyin": "xiàngmù shíbié",
      "meaning": "nhận dạng dự án",
      "example": "我们需要项目识别。",
      "examplePinyin": "Wǒmen xūyào xiàngmù shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng dự án."
    },
    {
      "word": "项目生成",
      "pinyin": "xiàngmù shēngchéng",
      "meaning": "tạo sinh dự án",
      "example": "我们需要项目生成。",
      "examplePinyin": "Wǒmen xūyào xiàngmù shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh dự án."
    },
    {
      "word": "项目通知",
      "pinyin": "xiàngmù tōngzhī",
      "meaning": "thông báo dự án",
      "example": "我们需要项目通知。",
      "examplePinyin": "Wǒmen xūyào xiàngmù tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo dự án."
    },
    {
      "word": "项目权限",
      "pinyin": "xiàngmù quánxiàn",
      "meaning": "quyền hạn dự án",
      "example": "我们需要项目权限。",
      "examplePinyin": "Wǒmen xūyào xiàngmù quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn dự án."
    },
    {
      "word": "项目状态",
      "pinyin": "xiàngmù zhuàngtài",
      "meaning": "trạng thái dự án",
      "example": "我们需要项目状态。",
      "examplePinyin": "Wǒmen xūyào xiàngmù zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái dự án."
    },
    {
      "word": "项目编号",
      "pinyin": "xiàngmù biānhào",
      "meaning": "mã số dự án",
      "example": "我们需要项目编号。",
      "examplePinyin": "Wǒmen xūyào xiàngmù biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số dự án."
    },
    {
      "word": "项目模板",
      "pinyin": "xiàngmù múbǎn",
      "meaning": "mẫu/template dự án",
      "example": "我们需要项目模板。",
      "examplePinyin": "Wǒmen xūyào xiàngmù múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template dự án."
    },
    {
      "word": "项目异常",
      "pinyin": "xiàngmù yìcháng",
      "meaning": "bất thường/lỗi dự án",
      "example": "我们需要项目异常。",
      "examplePinyin": "Wǒmen xūyào xiàngmù yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi dự án."
    },
    {
      "word": "任务管理",
      "pinyin": "rènwu guǎnlǐ",
      "meaning": "quản lý nhiệm vụ",
      "example": "我们需要任务管理。",
      "examplePinyin": "Wǒmen xūyào rènwu guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý nhiệm vụ."
    },
    {
      "word": "任务处理",
      "pinyin": "rènwu chǔlǐ",
      "meaning": "xử lý nhiệm vụ",
      "example": "我们需要任务处理。",
      "examplePinyin": "Wǒmen xūyào rènwu chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý nhiệm vụ."
    },
    {
      "word": "任务分析",
      "pinyin": "rènwu fēnxī",
      "meaning": "phân tích nhiệm vụ",
      "example": "我们需要任务分析。",
      "examplePinyin": "Wǒmen xūyào rènwu fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích nhiệm vụ."
    },
    {
      "word": "任务检查",
      "pinyin": "rènwu jiǎnchá",
      "meaning": "kiểm tra nhiệm vụ",
      "example": "我们需要任务检查。",
      "examplePinyin": "Wǒmen xūyào rènwu jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra nhiệm vụ."
    },
    {
      "word": "任务记录",
      "pinyin": "rènwu jìlù",
      "meaning": "ghi chép nhiệm vụ",
      "example": "我们需要任务记录。",
      "examplePinyin": "Wǒmen xūyào rènwu jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép nhiệm vụ."
    },
    {
      "word": "任务设置",
      "pinyin": "rènwu shèzhì",
      "meaning": "cài đặt nhiệm vụ",
      "example": "我们需要任务设置。",
      "examplePinyin": "Wǒmen xūyào rènwu shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt nhiệm vụ."
    },
    {
      "word": "任务更新",
      "pinyin": "rènwu gēngxīn",
      "meaning": "cập nhật nhiệm vụ",
      "example": "我们需要任务更新。",
      "examplePinyin": "Wǒmen xūyào rènwu gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật nhiệm vụ."
    },
    {
      "word": "任务优化",
      "pinyin": "rènwu yōuhuà",
      "meaning": "tối ưu hóa nhiệm vụ",
      "example": "我们需要任务优化。",
      "examplePinyin": "Wǒmen xūyào rènwu yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa nhiệm vụ."
    },
    {
      "word": "任务导入",
      "pinyin": "rènwu dǎorù",
      "meaning": "nhập vào nhiệm vụ",
      "example": "我们需要任务导入。",
      "examplePinyin": "Wǒmen xūyào rènwu dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào nhiệm vụ."
    },
    {
      "word": "任务导出",
      "pinyin": "rènwu dǎochū",
      "meaning": "xuất ra nhiệm vụ",
      "example": "我们需要任务导出。",
      "examplePinyin": "Wǒmen xūyào rènwu dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra nhiệm vụ."
    },
    {
      "word": "任务备份",
      "pinyin": "rènwu bèifèn",
      "meaning": "sao lưu nhiệm vụ",
      "example": "我们需要任务备份。",
      "examplePinyin": "Wǒmen xūyào rènwu bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu nhiệm vụ."
    },
    {
      "word": "任务同步",
      "pinyin": "rènwu tóngbù",
      "meaning": "đồng bộ nhiệm vụ",
      "example": "我们需要任务同步。",
      "examplePinyin": "Wǒmen xūyào rènwu tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ nhiệm vụ."
    },
    {
      "word": "任务搜索",
      "pinyin": "rènwu sōusuǒ",
      "meaning": "tìm kiếm nhiệm vụ",
      "example": "我们需要任务搜索。",
      "examplePinyin": "Wǒmen xūyào rènwu sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm nhiệm vụ."
    },
    {
      "word": "任务分类",
      "pinyin": "rènwu fēnlèi",
      "meaning": "phân loại nhiệm vụ",
      "example": "我们需要任务分类。",
      "examplePinyin": "Wǒmen xūyào rènwu fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại nhiệm vụ."
    },
    {
      "word": "任务统计",
      "pinyin": "rènwu tǒngjì",
      "meaning": "thống kê nhiệm vụ",
      "example": "我们需要任务统计。",
      "examplePinyin": "Wǒmen xūyào rènwu tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê nhiệm vụ."
    },
    {
      "word": "任务确认",
      "pinyin": "rènwu quèrèn",
      "meaning": "xác nhận nhiệm vụ",
      "example": "我们需要任务确认。",
      "examplePinyin": "Wǒmen xūyào rènwu quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận nhiệm vụ."
    },
    {
      "word": "任务审核",
      "pinyin": "rènwu shěnhé",
      "meaning": "duyệt/kiểm duyệt nhiệm vụ",
      "example": "我们需要任务审核。",
      "examplePinyin": "Wǒmen xūyào rènwu shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt nhiệm vụ."
    },
    {
      "word": "任务测试",
      "pinyin": "rènwu cèshì",
      "meaning": "kiểm thử nhiệm vụ",
      "example": "我们需要任务测试。",
      "examplePinyin": "Wǒmen xūyào rènwu cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử nhiệm vụ."
    },
    {
      "word": "任务维护",
      "pinyin": "rènwu wéihù",
      "meaning": "bảo trì nhiệm vụ",
      "example": "我们需要任务维护。",
      "examplePinyin": "Wǒmen xūyào rènwu wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì nhiệm vụ."
    },
    {
      "word": "任务设计",
      "pinyin": "rènwu shèjì",
      "meaning": "thiết kế nhiệm vụ",
      "example": "我们需要任务设计。",
      "examplePinyin": "Wǒmen xūyào rènwu shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế nhiệm vụ."
    },
    {
      "word": "任务开发",
      "pinyin": "rènwu kāifā",
      "meaning": "phát triển nhiệm vụ",
      "example": "我们需要任务开发。",
      "examplePinyin": "Wǒmen xūyào rènwu kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển nhiệm vụ."
    },
    {
      "word": "任务训练",
      "pinyin": "rènwu xùnliàn",
      "meaning": "huấn luyện nhiệm vụ",
      "example": "我们需要任务训练。",
      "examplePinyin": "Wǒmen xūyào rènwu xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện nhiệm vụ."
    },
    {
      "word": "任务识别",
      "pinyin": "rènwu shíbié",
      "meaning": "nhận dạng nhiệm vụ",
      "example": "我们需要任务识别。",
      "examplePinyin": "Wǒmen xūyào rènwu shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng nhiệm vụ."
    },
    {
      "word": "任务生成",
      "pinyin": "rènwu shēngchéng",
      "meaning": "tạo sinh nhiệm vụ",
      "example": "我们需要任务生成。",
      "examplePinyin": "Wǒmen xūyào rènwu shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh nhiệm vụ."
    },
    {
      "word": "任务通知",
      "pinyin": "rènwu tōngzhī",
      "meaning": "thông báo nhiệm vụ",
      "example": "我们需要任务通知。",
      "examplePinyin": "Wǒmen xūyào rènwu tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo nhiệm vụ."
    },
    {
      "word": "任务权限",
      "pinyin": "rènwu quánxiàn",
      "meaning": "quyền hạn nhiệm vụ",
      "example": "我们需要任务权限。",
      "examplePinyin": "Wǒmen xūyào rènwu quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn nhiệm vụ."
    },
    {
      "word": "任务状态",
      "pinyin": "rènwu zhuàngtài",
      "meaning": "trạng thái nhiệm vụ",
      "example": "我们需要任务状态。",
      "examplePinyin": "Wǒmen xūyào rènwu zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái nhiệm vụ."
    },
    {
      "word": "任务编号",
      "pinyin": "rènwu biānhào",
      "meaning": "mã số nhiệm vụ",
      "example": "我们需要任务编号。",
      "examplePinyin": "Wǒmen xūyào rènwu biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số nhiệm vụ."
    },
    {
      "word": "任务模板",
      "pinyin": "rènwu múbǎn",
      "meaning": "mẫu/template nhiệm vụ",
      "example": "我们需要任务模板。",
      "examplePinyin": "Wǒmen xūyào rènwu múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template nhiệm vụ."
    },
    {
      "word": "任务异常",
      "pinyin": "rènwu yìcháng",
      "meaning": "bất thường/lỗi nhiệm vụ",
      "example": "我们需要任务异常。",
      "examplePinyin": "Wǒmen xūyào rènwu yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi nhiệm vụ."
    },
    {
      "word": "流程管理",
      "pinyin": "liúchéng guǎnlǐ",
      "meaning": "quản lý quy trình",
      "example": "我们需要流程管理。",
      "examplePinyin": "Wǒmen xūyào liúchéng guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý quy trình."
    },
    {
      "word": "流程处理",
      "pinyin": "liúchéng chǔlǐ",
      "meaning": "xử lý quy trình",
      "example": "我们需要流程处理。",
      "examplePinyin": "Wǒmen xūyào liúchéng chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý quy trình."
    },
    {
      "word": "流程分析",
      "pinyin": "liúchéng fēnxī",
      "meaning": "phân tích quy trình",
      "example": "我们需要流程分析。",
      "examplePinyin": "Wǒmen xūyào liúchéng fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích quy trình."
    },
    {
      "word": "流程检查",
      "pinyin": "liúchéng jiǎnchá",
      "meaning": "kiểm tra quy trình",
      "example": "我们需要流程检查。",
      "examplePinyin": "Wǒmen xūyào liúchéng jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra quy trình."
    },
    {
      "word": "流程记录",
      "pinyin": "liúchéng jìlù",
      "meaning": "ghi chép quy trình",
      "example": "我们需要流程记录。",
      "examplePinyin": "Wǒmen xūyào liúchéng jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép quy trình."
    },
    {
      "word": "流程设置",
      "pinyin": "liúchéng shèzhì",
      "meaning": "cài đặt quy trình",
      "example": "我们需要流程设置。",
      "examplePinyin": "Wǒmen xūyào liúchéng shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt quy trình."
    },
    {
      "word": "流程更新",
      "pinyin": "liúchéng gēngxīn",
      "meaning": "cập nhật quy trình",
      "example": "我们需要流程更新。",
      "examplePinyin": "Wǒmen xūyào liúchéng gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật quy trình."
    },
    {
      "word": "流程优化",
      "pinyin": "liúchéng yōuhuà",
      "meaning": "tối ưu hóa quy trình",
      "example": "我们需要流程优化。",
      "examplePinyin": "Wǒmen xūyào liúchéng yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa quy trình."
    },
    {
      "word": "流程导入",
      "pinyin": "liúchéng dǎorù",
      "meaning": "nhập vào quy trình",
      "example": "我们需要流程导入。",
      "examplePinyin": "Wǒmen xūyào liúchéng dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào quy trình."
    },
    {
      "word": "流程导出",
      "pinyin": "liúchéng dǎochū",
      "meaning": "xuất ra quy trình",
      "example": "我们需要流程导出。",
      "examplePinyin": "Wǒmen xūyào liúchéng dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra quy trình."
    },
    {
      "word": "流程备份",
      "pinyin": "liúchéng bèifèn",
      "meaning": "sao lưu quy trình",
      "example": "我们需要流程备份。",
      "examplePinyin": "Wǒmen xūyào liúchéng bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu quy trình."
    },
    {
      "word": "流程同步",
      "pinyin": "liúchéng tóngbù",
      "meaning": "đồng bộ quy trình",
      "example": "我们需要流程同步。",
      "examplePinyin": "Wǒmen xūyào liúchéng tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ quy trình."
    },
    {
      "word": "流程搜索",
      "pinyin": "liúchéng sōusuǒ",
      "meaning": "tìm kiếm quy trình",
      "example": "我们需要流程搜索。",
      "examplePinyin": "Wǒmen xūyào liúchéng sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm quy trình."
    },
    {
      "word": "流程分类",
      "pinyin": "liúchéng fēnlèi",
      "meaning": "phân loại quy trình",
      "example": "我们需要流程分类。",
      "examplePinyin": "Wǒmen xūyào liúchéng fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại quy trình."
    },
    {
      "word": "流程统计",
      "pinyin": "liúchéng tǒngjì",
      "meaning": "thống kê quy trình",
      "example": "我们需要流程统计。",
      "examplePinyin": "Wǒmen xūyào liúchéng tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê quy trình."
    },
    {
      "word": "流程确认",
      "pinyin": "liúchéng quèrèn",
      "meaning": "xác nhận quy trình",
      "example": "我们需要流程确认。",
      "examplePinyin": "Wǒmen xūyào liúchéng quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận quy trình."
    },
    {
      "word": "流程审核",
      "pinyin": "liúchéng shěnhé",
      "meaning": "duyệt/kiểm duyệt quy trình",
      "example": "我们需要流程审核。",
      "examplePinyin": "Wǒmen xūyào liúchéng shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt quy trình."
    },
    {
      "word": "流程测试",
      "pinyin": "liúchéng cèshì",
      "meaning": "kiểm thử quy trình",
      "example": "我们需要流程测试。",
      "examplePinyin": "Wǒmen xūyào liúchéng cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử quy trình."
    },
    {
      "word": "流程维护",
      "pinyin": "liúchéng wéihù",
      "meaning": "bảo trì quy trình",
      "example": "我们需要流程维护。",
      "examplePinyin": "Wǒmen xūyào liúchéng wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì quy trình."
    },
    {
      "word": "流程设计",
      "pinyin": "liúchéng shèjì",
      "meaning": "thiết kế quy trình",
      "example": "我们需要流程设计。",
      "examplePinyin": "Wǒmen xūyào liúchéng shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế quy trình."
    },
    {
      "word": "流程开发",
      "pinyin": "liúchéng kāifā",
      "meaning": "phát triển quy trình",
      "example": "我们需要流程开发。",
      "examplePinyin": "Wǒmen xūyào liúchéng kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển quy trình."
    },
    {
      "word": "流程训练",
      "pinyin": "liúchéng xùnliàn",
      "meaning": "huấn luyện quy trình",
      "example": "我们需要流程训练。",
      "examplePinyin": "Wǒmen xūyào liúchéng xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện quy trình."
    },
    {
      "word": "流程识别",
      "pinyin": "liúchéng shíbié",
      "meaning": "nhận dạng quy trình",
      "example": "我们需要流程识别。",
      "examplePinyin": "Wǒmen xūyào liúchéng shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng quy trình."
    },
    {
      "word": "流程生成",
      "pinyin": "liúchéng shēngchéng",
      "meaning": "tạo sinh quy trình",
      "example": "我们需要流程生成。",
      "examplePinyin": "Wǒmen xūyào liúchéng shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh quy trình."
    },
    {
      "word": "流程通知",
      "pinyin": "liúchéng tōngzhī",
      "meaning": "thông báo quy trình",
      "example": "我们需要流程通知。",
      "examplePinyin": "Wǒmen xūyào liúchéng tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo quy trình."
    },
    {
      "word": "流程权限",
      "pinyin": "liúchéng quánxiàn",
      "meaning": "quyền hạn quy trình",
      "example": "我们需要流程权限。",
      "examplePinyin": "Wǒmen xūyào liúchéng quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn quy trình."
    },
    {
      "word": "流程状态",
      "pinyin": "liúchéng zhuàngtài",
      "meaning": "trạng thái quy trình",
      "example": "我们需要流程状态。",
      "examplePinyin": "Wǒmen xūyào liúchéng zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái quy trình."
    },
    {
      "word": "流程编号",
      "pinyin": "liúchéng biānhào",
      "meaning": "mã số quy trình",
      "example": "我们需要流程编号。",
      "examplePinyin": "Wǒmen xūyào liúchéng biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số quy trình."
    },
    {
      "word": "流程模板",
      "pinyin": "liúchéng múbǎn",
      "meaning": "mẫu/template quy trình",
      "example": "我们需要流程模板。",
      "examplePinyin": "Wǒmen xūyào liúchéng múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template quy trình."
    },
    {
      "word": "流程异常",
      "pinyin": "liúchéng yìcháng",
      "meaning": "bất thường/lỗi quy trình",
      "example": "我们需要流程异常。",
      "examplePinyin": "Wǒmen xūyào liúchéng yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi quy trình."
    },
    {
      "word": "报告管理",
      "pinyin": "bàogào guǎnlǐ",
      "meaning": "quản lý báo cáo",
      "example": "我们需要报告管理。",
      "examplePinyin": "Wǒmen xūyào bàogào guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý báo cáo."
    },
    {
      "word": "报告处理",
      "pinyin": "bàogào chǔlǐ",
      "meaning": "xử lý báo cáo",
      "example": "我们需要报告处理。",
      "examplePinyin": "Wǒmen xūyào bàogào chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý báo cáo."
    },
    {
      "word": "报告分析",
      "pinyin": "bàogào fēnxī",
      "meaning": "phân tích báo cáo",
      "example": "我们需要报告分析。",
      "examplePinyin": "Wǒmen xūyào bàogào fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích báo cáo."
    },
    {
      "word": "报告检查",
      "pinyin": "bàogào jiǎnchá",
      "meaning": "kiểm tra báo cáo",
      "example": "我们需要报告检查。",
      "examplePinyin": "Wǒmen xūyào bàogào jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra báo cáo."
    },
    {
      "word": "报告记录",
      "pinyin": "bàogào jìlù",
      "meaning": "ghi chép báo cáo",
      "example": "我们需要报告记录。",
      "examplePinyin": "Wǒmen xūyào bàogào jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép báo cáo."
    },
    {
      "word": "报告设置",
      "pinyin": "bàogào shèzhì",
      "meaning": "cài đặt báo cáo",
      "example": "我们需要报告设置。",
      "examplePinyin": "Wǒmen xūyào bàogào shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt báo cáo."
    },
    {
      "word": "报告更新",
      "pinyin": "bàogào gēngxīn",
      "meaning": "cập nhật báo cáo",
      "example": "我们需要报告更新。",
      "examplePinyin": "Wǒmen xūyào bàogào gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật báo cáo."
    },
    {
      "word": "报告优化",
      "pinyin": "bàogào yōuhuà",
      "meaning": "tối ưu hóa báo cáo",
      "example": "我们需要报告优化。",
      "examplePinyin": "Wǒmen xūyào bàogào yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa báo cáo."
    },
    {
      "word": "报告导入",
      "pinyin": "bàogào dǎorù",
      "meaning": "nhập vào báo cáo",
      "example": "我们需要报告导入。",
      "examplePinyin": "Wǒmen xūyào bàogào dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào báo cáo."
    },
    {
      "word": "报告导出",
      "pinyin": "bàogào dǎochū",
      "meaning": "xuất ra báo cáo",
      "example": "我们需要报告导出。",
      "examplePinyin": "Wǒmen xūyào bàogào dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra báo cáo."
    },
    {
      "word": "报告备份",
      "pinyin": "bàogào bèifèn",
      "meaning": "sao lưu báo cáo",
      "example": "我们需要报告备份。",
      "examplePinyin": "Wǒmen xūyào bàogào bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu báo cáo."
    },
    {
      "word": "报告同步",
      "pinyin": "bàogào tóngbù",
      "meaning": "đồng bộ báo cáo",
      "example": "我们需要报告同步。",
      "examplePinyin": "Wǒmen xūyào bàogào tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ báo cáo."
    },
    {
      "word": "报告搜索",
      "pinyin": "bàogào sōusuǒ",
      "meaning": "tìm kiếm báo cáo",
      "example": "我们需要报告搜索。",
      "examplePinyin": "Wǒmen xūyào bàogào sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm báo cáo."
    },
    {
      "word": "报告分类",
      "pinyin": "bàogào fēnlèi",
      "meaning": "phân loại báo cáo",
      "example": "我们需要报告分类。",
      "examplePinyin": "Wǒmen xūyào bàogào fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại báo cáo."
    },
    {
      "word": "报告统计",
      "pinyin": "bàogào tǒngjì",
      "meaning": "thống kê báo cáo",
      "example": "我们需要报告统计。",
      "examplePinyin": "Wǒmen xūyào bàogào tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê báo cáo."
    },
    {
      "word": "报告确认",
      "pinyin": "bàogào quèrèn",
      "meaning": "xác nhận báo cáo",
      "example": "我们需要报告确认。",
      "examplePinyin": "Wǒmen xūyào bàogào quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận báo cáo."
    },
    {
      "word": "报告审核",
      "pinyin": "bàogào shěnhé",
      "meaning": "duyệt/kiểm duyệt báo cáo",
      "example": "我们需要报告审核。",
      "examplePinyin": "Wǒmen xūyào bàogào shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt báo cáo."
    },
    {
      "word": "报告测试",
      "pinyin": "bàogào cèshì",
      "meaning": "kiểm thử báo cáo",
      "example": "我们需要报告测试。",
      "examplePinyin": "Wǒmen xūyào bàogào cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử báo cáo."
    },
    {
      "word": "报告维护",
      "pinyin": "bàogào wéihù",
      "meaning": "bảo trì báo cáo",
      "example": "我们需要报告维护。",
      "examplePinyin": "Wǒmen xūyào bàogào wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì báo cáo."
    },
    {
      "word": "报告设计",
      "pinyin": "bàogào shèjì",
      "meaning": "thiết kế báo cáo",
      "example": "我们需要报告设计。",
      "examplePinyin": "Wǒmen xūyào bàogào shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế báo cáo."
    },
    {
      "word": "报告开发",
      "pinyin": "bàogào kāifā",
      "meaning": "phát triển báo cáo",
      "example": "我们需要报告开发。",
      "examplePinyin": "Wǒmen xūyào bàogào kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển báo cáo."
    },
    {
      "word": "报告训练",
      "pinyin": "bàogào xùnliàn",
      "meaning": "huấn luyện báo cáo",
      "example": "我们需要报告训练。",
      "examplePinyin": "Wǒmen xūyào bàogào xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện báo cáo."
    },
    {
      "word": "报告识别",
      "pinyin": "bàogào shíbié",
      "meaning": "nhận dạng báo cáo",
      "example": "我们需要报告识别。",
      "examplePinyin": "Wǒmen xūyào bàogào shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng báo cáo."
    },
    {
      "word": "报告生成",
      "pinyin": "bàogào shēngchéng",
      "meaning": "tạo sinh báo cáo",
      "example": "我们需要报告生成。",
      "examplePinyin": "Wǒmen xūyào bàogào shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh báo cáo."
    },
    {
      "word": "报告通知",
      "pinyin": "bàogào tōngzhī",
      "meaning": "thông báo báo cáo",
      "example": "我们需要报告通知。",
      "examplePinyin": "Wǒmen xūyào bàogào tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo báo cáo."
    },
    {
      "word": "报告权限",
      "pinyin": "bàogào quánxiàn",
      "meaning": "quyền hạn báo cáo",
      "example": "我们需要报告权限。",
      "examplePinyin": "Wǒmen xūyào bàogào quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn báo cáo."
    },
    {
      "word": "报告状态",
      "pinyin": "bàogào zhuàngtài",
      "meaning": "trạng thái báo cáo",
      "example": "我们需要报告状态。",
      "examplePinyin": "Wǒmen xūyào bàogào zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái báo cáo."
    },
    {
      "word": "报告编号",
      "pinyin": "bàogào biānhào",
      "meaning": "mã số báo cáo",
      "example": "我们需要报告编号。",
      "examplePinyin": "Wǒmen xūyào bàogào biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số báo cáo."
    },
    {
      "word": "报告模板",
      "pinyin": "bàogào múbǎn",
      "meaning": "mẫu/template báo cáo",
      "example": "我们需要报告模板。",
      "examplePinyin": "Wǒmen xūyào bàogào múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template báo cáo."
    },
    {
      "word": "报告异常",
      "pinyin": "bàogào yìcháng",
      "meaning": "bất thường/lỗi báo cáo",
      "example": "我们需要报告异常。",
      "examplePinyin": "Wǒmen xūyào bàogào yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi báo cáo."
    },
    {
      "word": "计划管理",
      "pinyin": "jìhuà guǎnlǐ",
      "meaning": "quản lý kế hoạch",
      "example": "我们需要计划管理。",
      "examplePinyin": "Wǒmen xūyào jìhuà guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý kế hoạch."
    },
    {
      "word": "计划处理",
      "pinyin": "jìhuà chǔlǐ",
      "meaning": "xử lý kế hoạch",
      "example": "我们需要计划处理。",
      "examplePinyin": "Wǒmen xūyào jìhuà chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý kế hoạch."
    },
    {
      "word": "计划分析",
      "pinyin": "jìhuà fēnxī",
      "meaning": "phân tích kế hoạch",
      "example": "我们需要计划分析。",
      "examplePinyin": "Wǒmen xūyào jìhuà fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích kế hoạch."
    },
    {
      "word": "计划检查",
      "pinyin": "jìhuà jiǎnchá",
      "meaning": "kiểm tra kế hoạch",
      "example": "我们需要计划检查。",
      "examplePinyin": "Wǒmen xūyào jìhuà jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra kế hoạch."
    },
    {
      "word": "计划记录",
      "pinyin": "jìhuà jìlù",
      "meaning": "ghi chép kế hoạch",
      "example": "我们需要计划记录。",
      "examplePinyin": "Wǒmen xūyào jìhuà jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép kế hoạch."
    },
    {
      "word": "计划设置",
      "pinyin": "jìhuà shèzhì",
      "meaning": "cài đặt kế hoạch",
      "example": "我们需要计划设置。",
      "examplePinyin": "Wǒmen xūyào jìhuà shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt kế hoạch."
    },
    {
      "word": "计划更新",
      "pinyin": "jìhuà gēngxīn",
      "meaning": "cập nhật kế hoạch",
      "example": "我们需要计划更新。",
      "examplePinyin": "Wǒmen xūyào jìhuà gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật kế hoạch."
    },
    {
      "word": "计划优化",
      "pinyin": "jìhuà yōuhuà",
      "meaning": "tối ưu hóa kế hoạch",
      "example": "我们需要计划优化。",
      "examplePinyin": "Wǒmen xūyào jìhuà yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa kế hoạch."
    },
    {
      "word": "计划导入",
      "pinyin": "jìhuà dǎorù",
      "meaning": "nhập vào kế hoạch",
      "example": "我们需要计划导入。",
      "examplePinyin": "Wǒmen xūyào jìhuà dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào kế hoạch."
    },
    {
      "word": "计划导出",
      "pinyin": "jìhuà dǎochū",
      "meaning": "xuất ra kế hoạch",
      "example": "我们需要计划导出。",
      "examplePinyin": "Wǒmen xūyào jìhuà dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra kế hoạch."
    },
    {
      "word": "计划备份",
      "pinyin": "jìhuà bèifèn",
      "meaning": "sao lưu kế hoạch",
      "example": "我们需要计划备份。",
      "examplePinyin": "Wǒmen xūyào jìhuà bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu kế hoạch."
    },
    {
      "word": "计划同步",
      "pinyin": "jìhuà tóngbù",
      "meaning": "đồng bộ kế hoạch",
      "example": "我们需要计划同步。",
      "examplePinyin": "Wǒmen xūyào jìhuà tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ kế hoạch."
    },
    {
      "word": "计划搜索",
      "pinyin": "jìhuà sōusuǒ",
      "meaning": "tìm kiếm kế hoạch",
      "example": "我们需要计划搜索。",
      "examplePinyin": "Wǒmen xūyào jìhuà sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm kế hoạch."
    },
    {
      "word": "计划分类",
      "pinyin": "jìhuà fēnlèi",
      "meaning": "phân loại kế hoạch",
      "example": "我们需要计划分类。",
      "examplePinyin": "Wǒmen xūyào jìhuà fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại kế hoạch."
    },
    {
      "word": "计划统计",
      "pinyin": "jìhuà tǒngjì",
      "meaning": "thống kê kế hoạch",
      "example": "我们需要计划统计。",
      "examplePinyin": "Wǒmen xūyào jìhuà tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê kế hoạch."
    },
    {
      "word": "计划确认",
      "pinyin": "jìhuà quèrèn",
      "meaning": "xác nhận kế hoạch",
      "example": "我们需要计划确认。",
      "examplePinyin": "Wǒmen xūyào jìhuà quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận kế hoạch."
    },
    {
      "word": "计划审核",
      "pinyin": "jìhuà shěnhé",
      "meaning": "duyệt/kiểm duyệt kế hoạch",
      "example": "我们需要计划审核。",
      "examplePinyin": "Wǒmen xūyào jìhuà shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt kế hoạch."
    },
    {
      "word": "计划测试",
      "pinyin": "jìhuà cèshì",
      "meaning": "kiểm thử kế hoạch",
      "example": "我们需要计划测试。",
      "examplePinyin": "Wǒmen xūyào jìhuà cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử kế hoạch."
    },
    {
      "word": "计划维护",
      "pinyin": "jìhuà wéihù",
      "meaning": "bảo trì kế hoạch",
      "example": "我们需要计划维护。",
      "examplePinyin": "Wǒmen xūyào jìhuà wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì kế hoạch."
    },
    {
      "word": "计划设计",
      "pinyin": "jìhuà shèjì",
      "meaning": "thiết kế kế hoạch",
      "example": "我们需要计划设计。",
      "examplePinyin": "Wǒmen xūyào jìhuà shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế kế hoạch."
    },
    {
      "word": "计划开发",
      "pinyin": "jìhuà kāifā",
      "meaning": "phát triển kế hoạch",
      "example": "我们需要计划开发。",
      "examplePinyin": "Wǒmen xūyào jìhuà kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển kế hoạch."
    },
    {
      "word": "计划训练",
      "pinyin": "jìhuà xùnliàn",
      "meaning": "huấn luyện kế hoạch",
      "example": "我们需要计划训练。",
      "examplePinyin": "Wǒmen xūyào jìhuà xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện kế hoạch."
    },
    {
      "word": "计划识别",
      "pinyin": "jìhuà shíbié",
      "meaning": "nhận dạng kế hoạch",
      "example": "我们需要计划识别。",
      "examplePinyin": "Wǒmen xūyào jìhuà shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng kế hoạch."
    },
    {
      "word": "计划生成",
      "pinyin": "jìhuà shēngchéng",
      "meaning": "tạo sinh kế hoạch",
      "example": "我们需要计划生成。",
      "examplePinyin": "Wǒmen xūyào jìhuà shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh kế hoạch."
    },
    {
      "word": "计划通知",
      "pinyin": "jìhuà tōngzhī",
      "meaning": "thông báo kế hoạch",
      "example": "我们需要计划通知。",
      "examplePinyin": "Wǒmen xūyào jìhuà tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo kế hoạch."
    },
    {
      "word": "计划权限",
      "pinyin": "jìhuà quánxiàn",
      "meaning": "quyền hạn kế hoạch",
      "example": "我们需要计划权限。",
      "examplePinyin": "Wǒmen xūyào jìhuà quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn kế hoạch."
    },
    {
      "word": "计划状态",
      "pinyin": "jìhuà zhuàngtài",
      "meaning": "trạng thái kế hoạch",
      "example": "我们需要计划状态。",
      "examplePinyin": "Wǒmen xūyào jìhuà zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái kế hoạch."
    },
    {
      "word": "计划编号",
      "pinyin": "jìhuà biānhào",
      "meaning": "mã số kế hoạch",
      "example": "我们需要计划编号。",
      "examplePinyin": "Wǒmen xūyào jìhuà biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số kế hoạch."
    },
    {
      "word": "计划模板",
      "pinyin": "jìhuà múbǎn",
      "meaning": "mẫu/template kế hoạch",
      "example": "我们需要计划模板。",
      "examplePinyin": "Wǒmen xūyào jìhuà múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template kế hoạch."
    },
    {
      "word": "计划异常",
      "pinyin": "jìhuà yìcháng",
      "meaning": "bất thường/lỗi kế hoạch",
      "example": "我们需要计划异常。",
      "examplePinyin": "Wǒmen xūyào jìhuà yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi kế hoạch."
    },
    {
      "word": "部门管理",
      "pinyin": "bùmén guǎnlǐ",
      "meaning": "quản lý bộ phận",
      "example": "我们需要部门管理。",
      "examplePinyin": "Wǒmen xūyào bùmén guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý bộ phận."
    },
    {
      "word": "部门处理",
      "pinyin": "bùmén chǔlǐ",
      "meaning": "xử lý bộ phận",
      "example": "我们需要部门处理。",
      "examplePinyin": "Wǒmen xūyào bùmén chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý bộ phận."
    },
    {
      "word": "部门分析",
      "pinyin": "bùmén fēnxī",
      "meaning": "phân tích bộ phận",
      "example": "我们需要部门分析。",
      "examplePinyin": "Wǒmen xūyào bùmén fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích bộ phận."
    },
    {
      "word": "部门检查",
      "pinyin": "bùmén jiǎnchá",
      "meaning": "kiểm tra bộ phận",
      "example": "我们需要部门检查。",
      "examplePinyin": "Wǒmen xūyào bùmén jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra bộ phận."
    },
    {
      "word": "部门记录",
      "pinyin": "bùmén jìlù",
      "meaning": "ghi chép bộ phận",
      "example": "我们需要部门记录。",
      "examplePinyin": "Wǒmen xūyào bùmén jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép bộ phận."
    },
    {
      "word": "部门设置",
      "pinyin": "bùmén shèzhì",
      "meaning": "cài đặt bộ phận",
      "example": "我们需要部门设置。",
      "examplePinyin": "Wǒmen xūyào bùmén shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt bộ phận."
    },
    {
      "word": "部门更新",
      "pinyin": "bùmén gēngxīn",
      "meaning": "cập nhật bộ phận",
      "example": "我们需要部门更新。",
      "examplePinyin": "Wǒmen xūyào bùmén gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật bộ phận."
    },
    {
      "word": "部门优化",
      "pinyin": "bùmén yōuhuà",
      "meaning": "tối ưu hóa bộ phận",
      "example": "我们需要部门优化。",
      "examplePinyin": "Wǒmen xūyào bùmén yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa bộ phận."
    },
    {
      "word": "部门导入",
      "pinyin": "bùmén dǎorù",
      "meaning": "nhập vào bộ phận",
      "example": "我们需要部门导入。",
      "examplePinyin": "Wǒmen xūyào bùmén dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào bộ phận."
    },
    {
      "word": "部门导出",
      "pinyin": "bùmén dǎochū",
      "meaning": "xuất ra bộ phận",
      "example": "我们需要部门导出。",
      "examplePinyin": "Wǒmen xūyào bùmén dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra bộ phận."
    },
    {
      "word": "部门备份",
      "pinyin": "bùmén bèifèn",
      "meaning": "sao lưu bộ phận",
      "example": "我们需要部门备份。",
      "examplePinyin": "Wǒmen xūyào bùmén bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu bộ phận."
    },
    {
      "word": "部门同步",
      "pinyin": "bùmén tóngbù",
      "meaning": "đồng bộ bộ phận",
      "example": "我们需要部门同步。",
      "examplePinyin": "Wǒmen xūyào bùmén tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ bộ phận."
    },
    {
      "word": "部门搜索",
      "pinyin": "bùmén sōusuǒ",
      "meaning": "tìm kiếm bộ phận",
      "example": "我们需要部门搜索。",
      "examplePinyin": "Wǒmen xūyào bùmén sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm bộ phận."
    },
    {
      "word": "部门分类",
      "pinyin": "bùmén fēnlèi",
      "meaning": "phân loại bộ phận",
      "example": "我们需要部门分类。",
      "examplePinyin": "Wǒmen xūyào bùmén fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại bộ phận."
    },
    {
      "word": "部门统计",
      "pinyin": "bùmén tǒngjì",
      "meaning": "thống kê bộ phận",
      "example": "我们需要部门统计。",
      "examplePinyin": "Wǒmen xūyào bùmén tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê bộ phận."
    },
    {
      "word": "部门确认",
      "pinyin": "bùmén quèrèn",
      "meaning": "xác nhận bộ phận",
      "example": "我们需要部门确认。",
      "examplePinyin": "Wǒmen xūyào bùmén quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận bộ phận."
    },
    {
      "word": "部门审核",
      "pinyin": "bùmén shěnhé",
      "meaning": "duyệt/kiểm duyệt bộ phận",
      "example": "我们需要部门审核。",
      "examplePinyin": "Wǒmen xūyào bùmén shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt bộ phận."
    },
    {
      "word": "部门测试",
      "pinyin": "bùmén cèshì",
      "meaning": "kiểm thử bộ phận",
      "example": "我们需要部门测试。",
      "examplePinyin": "Wǒmen xūyào bùmén cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử bộ phận."
    },
    {
      "word": "部门维护",
      "pinyin": "bùmén wéihù",
      "meaning": "bảo trì bộ phận",
      "example": "我们需要部门维护。",
      "examplePinyin": "Wǒmen xūyào bùmén wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì bộ phận."
    },
    {
      "word": "部门设计",
      "pinyin": "bùmén shèjì",
      "meaning": "thiết kế bộ phận",
      "example": "我们需要部门设计。",
      "examplePinyin": "Wǒmen xūyào bùmén shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế bộ phận."
    },
    {
      "word": "部门开发",
      "pinyin": "bùmén kāifā",
      "meaning": "phát triển bộ phận",
      "example": "我们需要部门开发。",
      "examplePinyin": "Wǒmen xūyào bùmén kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển bộ phận."
    },
    {
      "word": "部门训练",
      "pinyin": "bùmén xùnliàn",
      "meaning": "huấn luyện bộ phận",
      "example": "我们需要部门训练。",
      "examplePinyin": "Wǒmen xūyào bùmén xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện bộ phận."
    },
    {
      "word": "部门识别",
      "pinyin": "bùmén shíbié",
      "meaning": "nhận dạng bộ phận",
      "example": "我们需要部门识别。",
      "examplePinyin": "Wǒmen xūyào bùmén shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng bộ phận."
    },
    {
      "word": "部门生成",
      "pinyin": "bùmén shēngchéng",
      "meaning": "tạo sinh bộ phận",
      "example": "我们需要部门生成。",
      "examplePinyin": "Wǒmen xūyào bùmén shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh bộ phận."
    },
    {
      "word": "部门通知",
      "pinyin": "bùmén tōngzhī",
      "meaning": "thông báo bộ phận",
      "example": "我们需要部门通知。",
      "examplePinyin": "Wǒmen xūyào bùmén tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo bộ phận."
    },
    {
      "word": "部门权限",
      "pinyin": "bùmén quánxiàn",
      "meaning": "quyền hạn bộ phận",
      "example": "我们需要部门权限。",
      "examplePinyin": "Wǒmen xūyào bùmén quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn bộ phận."
    },
    {
      "word": "部门状态",
      "pinyin": "bùmén zhuàngtài",
      "meaning": "trạng thái bộ phận",
      "example": "我们需要部门状态。",
      "examplePinyin": "Wǒmen xūyào bùmén zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái bộ phận."
    },
    {
      "word": "部门编号",
      "pinyin": "bùmén biānhào",
      "meaning": "mã số bộ phận",
      "example": "我们需要部门编号。",
      "examplePinyin": "Wǒmen xūyào bùmén biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số bộ phận."
    },
    {
      "word": "部门模板",
      "pinyin": "bùmén múbǎn",
      "meaning": "mẫu/template bộ phận",
      "example": "我们需要部门模板。",
      "examplePinyin": "Wǒmen xūyào bùmén múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template bộ phận."
    },
    {
      "word": "部门异常",
      "pinyin": "bùmén yìcháng",
      "meaning": "bất thường/lỗi bộ phận",
      "example": "我们需要部门异常。",
      "examplePinyin": "Wǒmen xūyào bùmén yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi bộ phận."
    },
    {
      "word": "职位管理",
      "pinyin": "zhíwèi guǎnlǐ",
      "meaning": "quản lý vị trí công việc",
      "example": "我们需要职位管理。",
      "examplePinyin": "Wǒmen xūyào zhíwèi guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý vị trí công việc."
    },
    {
      "word": "职位处理",
      "pinyin": "zhíwèi chǔlǐ",
      "meaning": "xử lý vị trí công việc",
      "example": "我们需要职位处理。",
      "examplePinyin": "Wǒmen xūyào zhíwèi chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý vị trí công việc."
    },
    {
      "word": "职位分析",
      "pinyin": "zhíwèi fēnxī",
      "meaning": "phân tích vị trí công việc",
      "example": "我们需要职位分析。",
      "examplePinyin": "Wǒmen xūyào zhíwèi fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích vị trí công việc."
    },
    {
      "word": "职位检查",
      "pinyin": "zhíwèi jiǎnchá",
      "meaning": "kiểm tra vị trí công việc",
      "example": "我们需要职位检查。",
      "examplePinyin": "Wǒmen xūyào zhíwèi jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra vị trí công việc."
    },
    {
      "word": "职位记录",
      "pinyin": "zhíwèi jìlù",
      "meaning": "ghi chép vị trí công việc",
      "example": "我们需要职位记录。",
      "examplePinyin": "Wǒmen xūyào zhíwèi jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép vị trí công việc."
    },
    {
      "word": "职位设置",
      "pinyin": "zhíwèi shèzhì",
      "meaning": "cài đặt vị trí công việc",
      "example": "我们需要职位设置。",
      "examplePinyin": "Wǒmen xūyào zhíwèi shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt vị trí công việc."
    },
    {
      "word": "职位更新",
      "pinyin": "zhíwèi gēngxīn",
      "meaning": "cập nhật vị trí công việc",
      "example": "我们需要职位更新。",
      "examplePinyin": "Wǒmen xūyào zhíwèi gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật vị trí công việc."
    },
    {
      "word": "职位优化",
      "pinyin": "zhíwèi yōuhuà",
      "meaning": "tối ưu hóa vị trí công việc",
      "example": "我们需要职位优化。",
      "examplePinyin": "Wǒmen xūyào zhíwèi yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa vị trí công việc."
    },
    {
      "word": "职位导入",
      "pinyin": "zhíwèi dǎorù",
      "meaning": "nhập vào vị trí công việc",
      "example": "我们需要职位导入。",
      "examplePinyin": "Wǒmen xūyào zhíwèi dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào vị trí công việc."
    },
    {
      "word": "职位导出",
      "pinyin": "zhíwèi dǎochū",
      "meaning": "xuất ra vị trí công việc",
      "example": "我们需要职位导出。",
      "examplePinyin": "Wǒmen xūyào zhíwèi dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra vị trí công việc."
    },
    {
      "word": "职位备份",
      "pinyin": "zhíwèi bèifèn",
      "meaning": "sao lưu vị trí công việc",
      "example": "我们需要职位备份。",
      "examplePinyin": "Wǒmen xūyào zhíwèi bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu vị trí công việc."
    },
    {
      "word": "职位同步",
      "pinyin": "zhíwèi tóngbù",
      "meaning": "đồng bộ vị trí công việc",
      "example": "我们需要职位同步。",
      "examplePinyin": "Wǒmen xūyào zhíwèi tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ vị trí công việc."
    },
    {
      "word": "职位搜索",
      "pinyin": "zhíwèi sōusuǒ",
      "meaning": "tìm kiếm vị trí công việc",
      "example": "我们需要职位搜索。",
      "examplePinyin": "Wǒmen xūyào zhíwèi sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm vị trí công việc."
    },
    {
      "word": "职位分类",
      "pinyin": "zhíwèi fēnlèi",
      "meaning": "phân loại vị trí công việc",
      "example": "我们需要职位分类。",
      "examplePinyin": "Wǒmen xūyào zhíwèi fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại vị trí công việc."
    },
    {
      "word": "职位统计",
      "pinyin": "zhíwèi tǒngjì",
      "meaning": "thống kê vị trí công việc",
      "example": "我们需要职位统计。",
      "examplePinyin": "Wǒmen xūyào zhíwèi tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê vị trí công việc."
    },
    {
      "word": "职位确认",
      "pinyin": "zhíwèi quèrèn",
      "meaning": "xác nhận vị trí công việc",
      "example": "我们需要职位确认。",
      "examplePinyin": "Wǒmen xūyào zhíwèi quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận vị trí công việc."
    },
    {
      "word": "职位审核",
      "pinyin": "zhíwèi shěnhé",
      "meaning": "duyệt/kiểm duyệt vị trí công việc",
      "example": "我们需要职位审核。",
      "examplePinyin": "Wǒmen xūyào zhíwèi shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt vị trí công việc."
    },
    {
      "word": "职位测试",
      "pinyin": "zhíwèi cèshì",
      "meaning": "kiểm thử vị trí công việc",
      "example": "我们需要职位测试。",
      "examplePinyin": "Wǒmen xūyào zhíwèi cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử vị trí công việc."
    },
    {
      "word": "职位维护",
      "pinyin": "zhíwèi wéihù",
      "meaning": "bảo trì vị trí công việc",
      "example": "我们需要职位维护。",
      "examplePinyin": "Wǒmen xūyào zhíwèi wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì vị trí công việc."
    },
    {
      "word": "职位设计",
      "pinyin": "zhíwèi shèjì",
      "meaning": "thiết kế vị trí công việc",
      "example": "我们需要职位设计。",
      "examplePinyin": "Wǒmen xūyào zhíwèi shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế vị trí công việc."
    },
    {
      "word": "职位开发",
      "pinyin": "zhíwèi kāifā",
      "meaning": "phát triển vị trí công việc",
      "example": "我们需要职位开发。",
      "examplePinyin": "Wǒmen xūyào zhíwèi kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển vị trí công việc."
    },
    {
      "word": "职位训练",
      "pinyin": "zhíwèi xùnliàn",
      "meaning": "huấn luyện vị trí công việc",
      "example": "我们需要职位训练。",
      "examplePinyin": "Wǒmen xūyào zhíwèi xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện vị trí công việc."
    },
    {
      "word": "职位识别",
      "pinyin": "zhíwèi shíbié",
      "meaning": "nhận dạng vị trí công việc",
      "example": "我们需要职位识别。",
      "examplePinyin": "Wǒmen xūyào zhíwèi shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng vị trí công việc."
    },
    {
      "word": "职位生成",
      "pinyin": "zhíwèi shēngchéng",
      "meaning": "tạo sinh vị trí công việc",
      "example": "我们需要职位生成。",
      "examplePinyin": "Wǒmen xūyào zhíwèi shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh vị trí công việc."
    },
    {
      "word": "职位通知",
      "pinyin": "zhíwèi tōngzhī",
      "meaning": "thông báo vị trí công việc",
      "example": "我们需要职位通知。",
      "examplePinyin": "Wǒmen xūyào zhíwèi tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo vị trí công việc."
    },
    {
      "word": "职位权限",
      "pinyin": "zhíwèi quánxiàn",
      "meaning": "quyền hạn vị trí công việc",
      "example": "我们需要职位权限。",
      "examplePinyin": "Wǒmen xūyào zhíwèi quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn vị trí công việc."
    },
    {
      "word": "职位状态",
      "pinyin": "zhíwèi zhuàngtài",
      "meaning": "trạng thái vị trí công việc",
      "example": "我们需要职位状态。",
      "examplePinyin": "Wǒmen xūyào zhíwèi zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái vị trí công việc."
    },
    {
      "word": "职位编号",
      "pinyin": "zhíwèi biānhào",
      "meaning": "mã số vị trí công việc",
      "example": "我们需要职位编号。",
      "examplePinyin": "Wǒmen xūyào zhíwèi biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số vị trí công việc."
    },
    {
      "word": "职位模板",
      "pinyin": "zhíwèi múbǎn",
      "meaning": "mẫu/template vị trí công việc",
      "example": "我们需要职位模板。",
      "examplePinyin": "Wǒmen xūyào zhíwèi múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template vị trí công việc."
    },
    {
      "word": "职位异常",
      "pinyin": "zhíwèi yìcháng",
      "meaning": "bất thường/lỗi vị trí công việc",
      "example": "我们需要职位异常。",
      "examplePinyin": "Wǒmen xūyào zhíwèi yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi vị trí công việc."
    },
    {
      "word": "简历管理",
      "pinyin": "jiǎnlì guǎnlǐ",
      "meaning": "quản lý CV",
      "example": "我们需要简历管理。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý CV."
    },
    {
      "word": "简历处理",
      "pinyin": "jiǎnlì chǔlǐ",
      "meaning": "xử lý CV",
      "example": "我们需要简历处理。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý CV."
    },
    {
      "word": "简历分析",
      "pinyin": "jiǎnlì fēnxī",
      "meaning": "phân tích CV",
      "example": "我们需要简历分析。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích CV."
    },
    {
      "word": "简历检查",
      "pinyin": "jiǎnlì jiǎnchá",
      "meaning": "kiểm tra CV",
      "example": "我们需要简历检查。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra CV."
    },
    {
      "word": "简历记录",
      "pinyin": "jiǎnlì jìlù",
      "meaning": "ghi chép CV",
      "example": "我们需要简历记录。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép CV."
    },
    {
      "word": "简历设置",
      "pinyin": "jiǎnlì shèzhì",
      "meaning": "cài đặt CV",
      "example": "我们需要简历设置。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt CV."
    },
    {
      "word": "简历更新",
      "pinyin": "jiǎnlì gēngxīn",
      "meaning": "cập nhật CV",
      "example": "我们需要简历更新。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật CV."
    },
    {
      "word": "简历优化",
      "pinyin": "jiǎnlì yōuhuà",
      "meaning": "tối ưu hóa CV",
      "example": "我们需要简历优化。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa CV."
    },
    {
      "word": "简历导入",
      "pinyin": "jiǎnlì dǎorù",
      "meaning": "nhập vào CV",
      "example": "我们需要简历导入。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào CV."
    },
    {
      "word": "简历导出",
      "pinyin": "jiǎnlì dǎochū",
      "meaning": "xuất ra CV",
      "example": "我们需要简历导出。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra CV."
    },
    {
      "word": "简历备份",
      "pinyin": "jiǎnlì bèifèn",
      "meaning": "sao lưu CV",
      "example": "我们需要简历备份。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu CV."
    },
    {
      "word": "简历同步",
      "pinyin": "jiǎnlì tóngbù",
      "meaning": "đồng bộ CV",
      "example": "我们需要简历同步。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ CV."
    },
    {
      "word": "简历搜索",
      "pinyin": "jiǎnlì sōusuǒ",
      "meaning": "tìm kiếm CV",
      "example": "我们需要简历搜索。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm CV."
    },
    {
      "word": "简历分类",
      "pinyin": "jiǎnlì fēnlèi",
      "meaning": "phân loại CV",
      "example": "我们需要简历分类。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại CV."
    },
    {
      "word": "简历统计",
      "pinyin": "jiǎnlì tǒngjì",
      "meaning": "thống kê CV",
      "example": "我们需要简历统计。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê CV."
    },
    {
      "word": "简历确认",
      "pinyin": "jiǎnlì quèrèn",
      "meaning": "xác nhận CV",
      "example": "我们需要简历确认。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận CV."
    },
    {
      "word": "简历审核",
      "pinyin": "jiǎnlì shěnhé",
      "meaning": "duyệt/kiểm duyệt CV",
      "example": "我们需要简历审核。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt CV."
    },
    {
      "word": "简历测试",
      "pinyin": "jiǎnlì cèshì",
      "meaning": "kiểm thử CV",
      "example": "我们需要简历测试。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử CV."
    },
    {
      "word": "简历维护",
      "pinyin": "jiǎnlì wéihù",
      "meaning": "bảo trì CV",
      "example": "我们需要简历维护。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì CV."
    },
    {
      "word": "简历设计",
      "pinyin": "jiǎnlì shèjì",
      "meaning": "thiết kế CV",
      "example": "我们需要简历设计。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế CV."
    },
    {
      "word": "简历开发",
      "pinyin": "jiǎnlì kāifā",
      "meaning": "phát triển CV",
      "example": "我们需要简历开发。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển CV."
    },
    {
      "word": "简历训练",
      "pinyin": "jiǎnlì xùnliàn",
      "meaning": "huấn luyện CV",
      "example": "我们需要简历训练。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện CV."
    },
    {
      "word": "简历识别",
      "pinyin": "jiǎnlì shíbié",
      "meaning": "nhận dạng CV",
      "example": "我们需要简历识别。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng CV."
    },
    {
      "word": "简历生成",
      "pinyin": "jiǎnlì shēngchéng",
      "meaning": "tạo sinh CV",
      "example": "我们需要简历生成。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh CV."
    },
    {
      "word": "简历通知",
      "pinyin": "jiǎnlì tōngzhī",
      "meaning": "thông báo CV",
      "example": "我们需要简历通知。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo CV."
    },
    {
      "word": "简历权限",
      "pinyin": "jiǎnlì quánxiàn",
      "meaning": "quyền hạn CV",
      "example": "我们需要简历权限。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn CV."
    },
    {
      "word": "简历状态",
      "pinyin": "jiǎnlì zhuàngtài",
      "meaning": "trạng thái CV",
      "example": "我们需要简历状态。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái CV."
    },
    {
      "word": "简历编号",
      "pinyin": "jiǎnlì biānhào",
      "meaning": "mã số CV",
      "example": "我们需要简历编号。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số CV."
    },
    {
      "word": "简历模板",
      "pinyin": "jiǎnlì múbǎn",
      "meaning": "mẫu/template CV",
      "example": "我们需要简历模板。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template CV."
    },
    {
      "word": "简历异常",
      "pinyin": "jiǎnlì yìcháng",
      "meaning": "bất thường/lỗi CV",
      "example": "我们需要简历异常。",
      "examplePinyin": "Wǒmen xūyào jiǎnlì yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi CV."
    },
    {
      "word": "面试管理",
      "pinyin": "miànshì guǎnlǐ",
      "meaning": "quản lý phỏng vấn",
      "example": "我们需要面试管理。",
      "examplePinyin": "Wǒmen xūyào miànshì guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý phỏng vấn."
    },
    {
      "word": "面试处理",
      "pinyin": "miànshì chǔlǐ",
      "meaning": "xử lý phỏng vấn",
      "example": "我们需要面试处理。",
      "examplePinyin": "Wǒmen xūyào miànshì chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý phỏng vấn."
    },
    {
      "word": "面试分析",
      "pinyin": "miànshì fēnxī",
      "meaning": "phân tích phỏng vấn",
      "example": "我们需要面试分析。",
      "examplePinyin": "Wǒmen xūyào miànshì fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích phỏng vấn."
    },
    {
      "word": "面试检查",
      "pinyin": "miànshì jiǎnchá",
      "meaning": "kiểm tra phỏng vấn",
      "example": "我们需要面试检查。",
      "examplePinyin": "Wǒmen xūyào miànshì jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra phỏng vấn."
    },
    {
      "word": "面试记录",
      "pinyin": "miànshì jìlù",
      "meaning": "ghi chép phỏng vấn",
      "example": "我们需要面试记录。",
      "examplePinyin": "Wǒmen xūyào miànshì jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép phỏng vấn."
    },
    {
      "word": "面试设置",
      "pinyin": "miànshì shèzhì",
      "meaning": "cài đặt phỏng vấn",
      "example": "我们需要面试设置。",
      "examplePinyin": "Wǒmen xūyào miànshì shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt phỏng vấn."
    },
    {
      "word": "面试更新",
      "pinyin": "miànshì gēngxīn",
      "meaning": "cập nhật phỏng vấn",
      "example": "我们需要面试更新。",
      "examplePinyin": "Wǒmen xūyào miànshì gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật phỏng vấn."
    },
    {
      "word": "面试优化",
      "pinyin": "miànshì yōuhuà",
      "meaning": "tối ưu hóa phỏng vấn",
      "example": "我们需要面试优化。",
      "examplePinyin": "Wǒmen xūyào miànshì yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa phỏng vấn."
    },
    {
      "word": "面试导入",
      "pinyin": "miànshì dǎorù",
      "meaning": "nhập vào phỏng vấn",
      "example": "我们需要面试导入。",
      "examplePinyin": "Wǒmen xūyào miànshì dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào phỏng vấn."
    },
    {
      "word": "面试导出",
      "pinyin": "miànshì dǎochū",
      "meaning": "xuất ra phỏng vấn",
      "example": "我们需要面试导出。",
      "examplePinyin": "Wǒmen xūyào miànshì dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra phỏng vấn."
    },
    {
      "word": "面试备份",
      "pinyin": "miànshì bèifèn",
      "meaning": "sao lưu phỏng vấn",
      "example": "我们需要面试备份。",
      "examplePinyin": "Wǒmen xūyào miànshì bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu phỏng vấn."
    },
    {
      "word": "面试同步",
      "pinyin": "miànshì tóngbù",
      "meaning": "đồng bộ phỏng vấn",
      "example": "我们需要面试同步。",
      "examplePinyin": "Wǒmen xūyào miànshì tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ phỏng vấn."
    },
    {
      "word": "面试搜索",
      "pinyin": "miànshì sōusuǒ",
      "meaning": "tìm kiếm phỏng vấn",
      "example": "我们需要面试搜索。",
      "examplePinyin": "Wǒmen xūyào miànshì sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm phỏng vấn."
    },
    {
      "word": "面试分类",
      "pinyin": "miànshì fēnlèi",
      "meaning": "phân loại phỏng vấn",
      "example": "我们需要面试分类。",
      "examplePinyin": "Wǒmen xūyào miànshì fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại phỏng vấn."
    },
    {
      "word": "面试统计",
      "pinyin": "miànshì tǒngjì",
      "meaning": "thống kê phỏng vấn",
      "example": "我们需要面试统计。",
      "examplePinyin": "Wǒmen xūyào miànshì tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê phỏng vấn."
    },
    {
      "word": "面试确认",
      "pinyin": "miànshì quèrèn",
      "meaning": "xác nhận phỏng vấn",
      "example": "我们需要面试确认。",
      "examplePinyin": "Wǒmen xūyào miànshì quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận phỏng vấn."
    },
    {
      "word": "面试审核",
      "pinyin": "miànshì shěnhé",
      "meaning": "duyệt/kiểm duyệt phỏng vấn",
      "example": "我们需要面试审核。",
      "examplePinyin": "Wǒmen xūyào miànshì shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt phỏng vấn."
    },
    {
      "word": "面试测试",
      "pinyin": "miànshì cèshì",
      "meaning": "kiểm thử phỏng vấn",
      "example": "我们需要面试测试。",
      "examplePinyin": "Wǒmen xūyào miànshì cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử phỏng vấn."
    },
    {
      "word": "面试维护",
      "pinyin": "miànshì wéihù",
      "meaning": "bảo trì phỏng vấn",
      "example": "我们需要面试维护。",
      "examplePinyin": "Wǒmen xūyào miànshì wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì phỏng vấn."
    },
    {
      "word": "面试设计",
      "pinyin": "miànshì shèjì",
      "meaning": "thiết kế phỏng vấn",
      "example": "我们需要面试设计。",
      "examplePinyin": "Wǒmen xūyào miànshì shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế phỏng vấn."
    },
    {
      "word": "面试开发",
      "pinyin": "miànshì kāifā",
      "meaning": "phát triển phỏng vấn",
      "example": "我们需要面试开发。",
      "examplePinyin": "Wǒmen xūyào miànshì kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển phỏng vấn."
    },
    {
      "word": "面试训练",
      "pinyin": "miànshì xùnliàn",
      "meaning": "huấn luyện phỏng vấn",
      "example": "我们需要面试训练。",
      "examplePinyin": "Wǒmen xūyào miànshì xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện phỏng vấn."
    },
    {
      "word": "面试识别",
      "pinyin": "miànshì shíbié",
      "meaning": "nhận dạng phỏng vấn",
      "example": "我们需要面试识别。",
      "examplePinyin": "Wǒmen xūyào miànshì shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng phỏng vấn."
    },
    {
      "word": "面试生成",
      "pinyin": "miànshì shēngchéng",
      "meaning": "tạo sinh phỏng vấn",
      "example": "我们需要面试生成。",
      "examplePinyin": "Wǒmen xūyào miànshì shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh phỏng vấn."
    },
    {
      "word": "面试通知",
      "pinyin": "miànshì tōngzhī",
      "meaning": "thông báo phỏng vấn",
      "example": "我们需要面试通知。",
      "examplePinyin": "Wǒmen xūyào miànshì tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo phỏng vấn."
    },
    {
      "word": "面试权限",
      "pinyin": "miànshì quánxiàn",
      "meaning": "quyền hạn phỏng vấn",
      "example": "我们需要面试权限。",
      "examplePinyin": "Wǒmen xūyào miànshì quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn phỏng vấn."
    },
    {
      "word": "面试状态",
      "pinyin": "miànshì zhuàngtài",
      "meaning": "trạng thái phỏng vấn",
      "example": "我们需要面试状态。",
      "examplePinyin": "Wǒmen xūyào miànshì zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái phỏng vấn."
    },
    {
      "word": "面试编号",
      "pinyin": "miànshì biānhào",
      "meaning": "mã số phỏng vấn",
      "example": "我们需要面试编号。",
      "examplePinyin": "Wǒmen xūyào miànshì biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số phỏng vấn."
    },
    {
      "word": "面试模板",
      "pinyin": "miànshì múbǎn",
      "meaning": "mẫu/template phỏng vấn",
      "example": "我们需要面试模板。",
      "examplePinyin": "Wǒmen xūyào miànshì múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template phỏng vấn."
    },
    {
      "word": "面试异常",
      "pinyin": "miànshì yìcháng",
      "meaning": "bất thường/lỗi phỏng vấn",
      "example": "我们需要面试异常。",
      "examplePinyin": "Wǒmen xūyào miànshì yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi phỏng vấn."
    },
    {
      "word": "培训管理",
      "pinyin": "péixùn guǎnlǐ",
      "meaning": "quản lý đào tạo",
      "example": "我们需要培训管理。",
      "examplePinyin": "Wǒmen xūyào péixùn guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý đào tạo."
    },
    {
      "word": "培训处理",
      "pinyin": "péixùn chǔlǐ",
      "meaning": "xử lý đào tạo",
      "example": "我们需要培训处理。",
      "examplePinyin": "Wǒmen xūyào péixùn chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý đào tạo."
    },
    {
      "word": "培训分析",
      "pinyin": "péixùn fēnxī",
      "meaning": "phân tích đào tạo",
      "example": "我们需要培训分析。",
      "examplePinyin": "Wǒmen xūyào péixùn fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích đào tạo."
    },
    {
      "word": "培训检查",
      "pinyin": "péixùn jiǎnchá",
      "meaning": "kiểm tra đào tạo",
      "example": "我们需要培训检查。",
      "examplePinyin": "Wǒmen xūyào péixùn jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra đào tạo."
    },
    {
      "word": "培训记录",
      "pinyin": "péixùn jìlù",
      "meaning": "ghi chép đào tạo",
      "example": "我们需要培训记录。",
      "examplePinyin": "Wǒmen xūyào péixùn jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép đào tạo."
    },
    {
      "word": "培训设置",
      "pinyin": "péixùn shèzhì",
      "meaning": "cài đặt đào tạo",
      "example": "我们需要培训设置。",
      "examplePinyin": "Wǒmen xūyào péixùn shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt đào tạo."
    },
    {
      "word": "培训更新",
      "pinyin": "péixùn gēngxīn",
      "meaning": "cập nhật đào tạo",
      "example": "我们需要培训更新。",
      "examplePinyin": "Wǒmen xūyào péixùn gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật đào tạo."
    },
    {
      "word": "培训优化",
      "pinyin": "péixùn yōuhuà",
      "meaning": "tối ưu hóa đào tạo",
      "example": "我们需要培训优化。",
      "examplePinyin": "Wǒmen xūyào péixùn yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa đào tạo."
    },
    {
      "word": "培训导入",
      "pinyin": "péixùn dǎorù",
      "meaning": "nhập vào đào tạo",
      "example": "我们需要培训导入。",
      "examplePinyin": "Wǒmen xūyào péixùn dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào đào tạo."
    },
    {
      "word": "培训导出",
      "pinyin": "péixùn dǎochū",
      "meaning": "xuất ra đào tạo",
      "example": "我们需要培训导出。",
      "examplePinyin": "Wǒmen xūyào péixùn dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra đào tạo."
    },
    {
      "word": "培训备份",
      "pinyin": "péixùn bèifèn",
      "meaning": "sao lưu đào tạo",
      "example": "我们需要培训备份。",
      "examplePinyin": "Wǒmen xūyào péixùn bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu đào tạo."
    },
    {
      "word": "培训同步",
      "pinyin": "péixùn tóngbù",
      "meaning": "đồng bộ đào tạo",
      "example": "我们需要培训同步。",
      "examplePinyin": "Wǒmen xūyào péixùn tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ đào tạo."
    },
    {
      "word": "培训搜索",
      "pinyin": "péixùn sōusuǒ",
      "meaning": "tìm kiếm đào tạo",
      "example": "我们需要培训搜索。",
      "examplePinyin": "Wǒmen xūyào péixùn sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm đào tạo."
    },
    {
      "word": "培训分类",
      "pinyin": "péixùn fēnlèi",
      "meaning": "phân loại đào tạo",
      "example": "我们需要培训分类。",
      "examplePinyin": "Wǒmen xūyào péixùn fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại đào tạo."
    },
    {
      "word": "培训统计",
      "pinyin": "péixùn tǒngjì",
      "meaning": "thống kê đào tạo",
      "example": "我们需要培训统计。",
      "examplePinyin": "Wǒmen xūyào péixùn tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê đào tạo."
    },
    {
      "word": "培训确认",
      "pinyin": "péixùn quèrèn",
      "meaning": "xác nhận đào tạo",
      "example": "我们需要培训确认。",
      "examplePinyin": "Wǒmen xūyào péixùn quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận đào tạo."
    },
    {
      "word": "培训审核",
      "pinyin": "péixùn shěnhé",
      "meaning": "duyệt/kiểm duyệt đào tạo",
      "example": "我们需要培训审核。",
      "examplePinyin": "Wǒmen xūyào péixùn shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt đào tạo."
    },
    {
      "word": "培训测试",
      "pinyin": "péixùn cèshì",
      "meaning": "kiểm thử đào tạo",
      "example": "我们需要培训测试。",
      "examplePinyin": "Wǒmen xūyào péixùn cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử đào tạo."
    },
    {
      "word": "培训维护",
      "pinyin": "péixùn wéihù",
      "meaning": "bảo trì đào tạo",
      "example": "我们需要培训维护。",
      "examplePinyin": "Wǒmen xūyào péixùn wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì đào tạo."
    },
    {
      "word": "培训设计",
      "pinyin": "péixùn shèjì",
      "meaning": "thiết kế đào tạo",
      "example": "我们需要培训设计。",
      "examplePinyin": "Wǒmen xūyào péixùn shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế đào tạo."
    },
    {
      "word": "培训开发",
      "pinyin": "péixùn kāifā",
      "meaning": "phát triển đào tạo",
      "example": "我们需要培训开发。",
      "examplePinyin": "Wǒmen xūyào péixùn kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển đào tạo."
    },
    {
      "word": "培训训练",
      "pinyin": "péixùn xùnliàn",
      "meaning": "huấn luyện đào tạo",
      "example": "我们需要培训训练。",
      "examplePinyin": "Wǒmen xūyào péixùn xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện đào tạo."
    },
    {
      "word": "培训识别",
      "pinyin": "péixùn shíbié",
      "meaning": "nhận dạng đào tạo",
      "example": "我们需要培训识别。",
      "examplePinyin": "Wǒmen xūyào péixùn shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng đào tạo."
    },
    {
      "word": "培训生成",
      "pinyin": "péixùn shēngchéng",
      "meaning": "tạo sinh đào tạo",
      "example": "我们需要培训生成。",
      "examplePinyin": "Wǒmen xūyào péixùn shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh đào tạo."
    },
    {
      "word": "培训通知",
      "pinyin": "péixùn tōngzhī",
      "meaning": "thông báo đào tạo",
      "example": "我们需要培训通知。",
      "examplePinyin": "Wǒmen xūyào péixùn tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo đào tạo."
    },
    {
      "word": "培训权限",
      "pinyin": "péixùn quánxiàn",
      "meaning": "quyền hạn đào tạo",
      "example": "我们需要培训权限。",
      "examplePinyin": "Wǒmen xūyào péixùn quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn đào tạo."
    },
    {
      "word": "培训状态",
      "pinyin": "péixùn zhuàngtài",
      "meaning": "trạng thái đào tạo",
      "example": "我们需要培训状态。",
      "examplePinyin": "Wǒmen xūyào péixùn zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái đào tạo."
    },
    {
      "word": "培训编号",
      "pinyin": "péixùn biānhào",
      "meaning": "mã số đào tạo",
      "example": "我们需要培训编号。",
      "examplePinyin": "Wǒmen xūyào péixùn biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số đào tạo."
    },
    {
      "word": "培训模板",
      "pinyin": "péixùn múbǎn",
      "meaning": "mẫu/template đào tạo",
      "example": "我们需要培训模板。",
      "examplePinyin": "Wǒmen xūyào péixùn múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template đào tạo."
    },
    {
      "word": "培训异常",
      "pinyin": "péixùn yìcháng",
      "meaning": "bất thường/lỗi đào tạo",
      "example": "我们需要培训异常。",
      "examplePinyin": "Wǒmen xūyào péixùn yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi đào tạo."
    },
    {
      "word": "考勤管理",
      "pinyin": "kǎoqín guǎnlǐ",
      "meaning": "quản lý chấm công",
      "example": "我们需要考勤管理。",
      "examplePinyin": "Wǒmen xūyào kǎoqín guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý chấm công."
    },
    {
      "word": "考勤处理",
      "pinyin": "kǎoqín chǔlǐ",
      "meaning": "xử lý chấm công",
      "example": "我们需要考勤处理。",
      "examplePinyin": "Wǒmen xūyào kǎoqín chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý chấm công."
    },
    {
      "word": "考勤分析",
      "pinyin": "kǎoqín fēnxī",
      "meaning": "phân tích chấm công",
      "example": "我们需要考勤分析。",
      "examplePinyin": "Wǒmen xūyào kǎoqín fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích chấm công."
    },
    {
      "word": "考勤检查",
      "pinyin": "kǎoqín jiǎnchá",
      "meaning": "kiểm tra chấm công",
      "example": "我们需要考勤检查。",
      "examplePinyin": "Wǒmen xūyào kǎoqín jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra chấm công."
    },
    {
      "word": "考勤记录",
      "pinyin": "kǎoqín jìlù",
      "meaning": "ghi chép chấm công",
      "example": "我们需要考勤记录。",
      "examplePinyin": "Wǒmen xūyào kǎoqín jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép chấm công."
    },
    {
      "word": "考勤设置",
      "pinyin": "kǎoqín shèzhì",
      "meaning": "cài đặt chấm công",
      "example": "我们需要考勤设置。",
      "examplePinyin": "Wǒmen xūyào kǎoqín shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt chấm công."
    },
    {
      "word": "考勤更新",
      "pinyin": "kǎoqín gēngxīn",
      "meaning": "cập nhật chấm công",
      "example": "我们需要考勤更新。",
      "examplePinyin": "Wǒmen xūyào kǎoqín gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật chấm công."
    },
    {
      "word": "考勤优化",
      "pinyin": "kǎoqín yōuhuà",
      "meaning": "tối ưu hóa chấm công",
      "example": "我们需要考勤优化。",
      "examplePinyin": "Wǒmen xūyào kǎoqín yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa chấm công."
    },
    {
      "word": "考勤导入",
      "pinyin": "kǎoqín dǎorù",
      "meaning": "nhập vào chấm công",
      "example": "我们需要考勤导入。",
      "examplePinyin": "Wǒmen xūyào kǎoqín dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào chấm công."
    },
    {
      "word": "考勤导出",
      "pinyin": "kǎoqín dǎochū",
      "meaning": "xuất ra chấm công",
      "example": "我们需要考勤导出。",
      "examplePinyin": "Wǒmen xūyào kǎoqín dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra chấm công."
    },
    {
      "word": "考勤备份",
      "pinyin": "kǎoqín bèifèn",
      "meaning": "sao lưu chấm công",
      "example": "我们需要考勤备份。",
      "examplePinyin": "Wǒmen xūyào kǎoqín bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu chấm công."
    },
    {
      "word": "考勤同步",
      "pinyin": "kǎoqín tóngbù",
      "meaning": "đồng bộ chấm công",
      "example": "我们需要考勤同步。",
      "examplePinyin": "Wǒmen xūyào kǎoqín tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ chấm công."
    },
    {
      "word": "考勤搜索",
      "pinyin": "kǎoqín sōusuǒ",
      "meaning": "tìm kiếm chấm công",
      "example": "我们需要考勤搜索。",
      "examplePinyin": "Wǒmen xūyào kǎoqín sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm chấm công."
    },
    {
      "word": "考勤分类",
      "pinyin": "kǎoqín fēnlèi",
      "meaning": "phân loại chấm công",
      "example": "我们需要考勤分类。",
      "examplePinyin": "Wǒmen xūyào kǎoqín fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại chấm công."
    },
    {
      "word": "考勤统计",
      "pinyin": "kǎoqín tǒngjì",
      "meaning": "thống kê chấm công",
      "example": "我们需要考勤统计。",
      "examplePinyin": "Wǒmen xūyào kǎoqín tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê chấm công."
    },
    {
      "word": "考勤确认",
      "pinyin": "kǎoqín quèrèn",
      "meaning": "xác nhận chấm công",
      "example": "我们需要考勤确认。",
      "examplePinyin": "Wǒmen xūyào kǎoqín quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận chấm công."
    },
    {
      "word": "考勤审核",
      "pinyin": "kǎoqín shěnhé",
      "meaning": "duyệt/kiểm duyệt chấm công",
      "example": "我们需要考勤审核。",
      "examplePinyin": "Wǒmen xūyào kǎoqín shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt chấm công."
    },
    {
      "word": "考勤测试",
      "pinyin": "kǎoqín cèshì",
      "meaning": "kiểm thử chấm công",
      "example": "我们需要考勤测试。",
      "examplePinyin": "Wǒmen xūyào kǎoqín cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử chấm công."
    },
    {
      "word": "考勤维护",
      "pinyin": "kǎoqín wéihù",
      "meaning": "bảo trì chấm công",
      "example": "我们需要考勤维护。",
      "examplePinyin": "Wǒmen xūyào kǎoqín wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì chấm công."
    },
    {
      "word": "考勤设计",
      "pinyin": "kǎoqín shèjì",
      "meaning": "thiết kế chấm công",
      "example": "我们需要考勤设计。",
      "examplePinyin": "Wǒmen xūyào kǎoqín shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế chấm công."
    },
    {
      "word": "考勤开发",
      "pinyin": "kǎoqín kāifā",
      "meaning": "phát triển chấm công",
      "example": "我们需要考勤开发。",
      "examplePinyin": "Wǒmen xūyào kǎoqín kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển chấm công."
    },
    {
      "word": "考勤训练",
      "pinyin": "kǎoqín xùnliàn",
      "meaning": "huấn luyện chấm công",
      "example": "我们需要考勤训练。",
      "examplePinyin": "Wǒmen xūyào kǎoqín xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện chấm công."
    },
    {
      "word": "考勤识别",
      "pinyin": "kǎoqín shíbié",
      "meaning": "nhận dạng chấm công",
      "example": "我们需要考勤识别。",
      "examplePinyin": "Wǒmen xūyào kǎoqín shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng chấm công."
    },
    {
      "word": "考勤生成",
      "pinyin": "kǎoqín shēngchéng",
      "meaning": "tạo sinh chấm công",
      "example": "我们需要考勤生成。",
      "examplePinyin": "Wǒmen xūyào kǎoqín shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh chấm công."
    },
    {
      "word": "考勤通知",
      "pinyin": "kǎoqín tōngzhī",
      "meaning": "thông báo chấm công",
      "example": "我们需要考勤通知。",
      "examplePinyin": "Wǒmen xūyào kǎoqín tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo chấm công."
    },
    {
      "word": "考勤权限",
      "pinyin": "kǎoqín quánxiàn",
      "meaning": "quyền hạn chấm công",
      "example": "我们需要考勤权限。",
      "examplePinyin": "Wǒmen xūyào kǎoqín quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn chấm công."
    },
    {
      "word": "考勤状态",
      "pinyin": "kǎoqín zhuàngtài",
      "meaning": "trạng thái chấm công",
      "example": "我们需要考勤状态。",
      "examplePinyin": "Wǒmen xūyào kǎoqín zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái chấm công."
    },
    {
      "word": "考勤编号",
      "pinyin": "kǎoqín biānhào",
      "meaning": "mã số chấm công",
      "example": "我们需要考勤编号。",
      "examplePinyin": "Wǒmen xūyào kǎoqín biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số chấm công."
    },
    {
      "word": "考勤模板",
      "pinyin": "kǎoqín múbǎn",
      "meaning": "mẫu/template chấm công",
      "example": "我们需要考勤模板。",
      "examplePinyin": "Wǒmen xūyào kǎoqín múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template chấm công."
    },
    {
      "word": "考勤异常",
      "pinyin": "kǎoqín yìcháng",
      "meaning": "bất thường/lỗi chấm công",
      "example": "我们需要考勤异常。",
      "examplePinyin": "Wǒmen xūyào kǎoqín yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi chấm công."
    },
    {
      "word": "加班管理",
      "pinyin": "jiābān guǎnlǐ",
      "meaning": "quản lý tăng ca",
      "example": "我们需要加班管理。",
      "examplePinyin": "Wǒmen xūyào jiābān guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý tăng ca."
    },
    {
      "word": "加班处理",
      "pinyin": "jiābān chǔlǐ",
      "meaning": "xử lý tăng ca",
      "example": "我们需要加班处理。",
      "examplePinyin": "Wǒmen xūyào jiābān chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý tăng ca."
    },
    {
      "word": "加班分析",
      "pinyin": "jiābān fēnxī",
      "meaning": "phân tích tăng ca",
      "example": "我们需要加班分析。",
      "examplePinyin": "Wǒmen xūyào jiābān fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích tăng ca."
    },
    {
      "word": "加班检查",
      "pinyin": "jiābān jiǎnchá",
      "meaning": "kiểm tra tăng ca",
      "example": "我们需要加班检查。",
      "examplePinyin": "Wǒmen xūyào jiābān jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra tăng ca."
    },
    {
      "word": "加班记录",
      "pinyin": "jiābān jìlù",
      "meaning": "ghi chép tăng ca",
      "example": "我们需要加班记录。",
      "examplePinyin": "Wǒmen xūyào jiābān jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép tăng ca."
    },
    {
      "word": "加班设置",
      "pinyin": "jiābān shèzhì",
      "meaning": "cài đặt tăng ca",
      "example": "我们需要加班设置。",
      "examplePinyin": "Wǒmen xūyào jiābān shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt tăng ca."
    },
    {
      "word": "加班更新",
      "pinyin": "jiābān gēngxīn",
      "meaning": "cập nhật tăng ca",
      "example": "我们需要加班更新。",
      "examplePinyin": "Wǒmen xūyào jiābān gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật tăng ca."
    },
    {
      "word": "加班优化",
      "pinyin": "jiābān yōuhuà",
      "meaning": "tối ưu hóa tăng ca",
      "example": "我们需要加班优化。",
      "examplePinyin": "Wǒmen xūyào jiābān yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa tăng ca."
    },
    {
      "word": "加班导入",
      "pinyin": "jiābān dǎorù",
      "meaning": "nhập vào tăng ca",
      "example": "我们需要加班导入。",
      "examplePinyin": "Wǒmen xūyào jiābān dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào tăng ca."
    },
    {
      "word": "加班导出",
      "pinyin": "jiābān dǎochū",
      "meaning": "xuất ra tăng ca",
      "example": "我们需要加班导出。",
      "examplePinyin": "Wǒmen xūyào jiābān dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra tăng ca."
    },
    {
      "word": "加班备份",
      "pinyin": "jiābān bèifèn",
      "meaning": "sao lưu tăng ca",
      "example": "我们需要加班备份。",
      "examplePinyin": "Wǒmen xūyào jiābān bèifèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần sao lưu tăng ca."
    },
    {
      "word": "加班同步",
      "pinyin": "jiābān tóngbù",
      "meaning": "đồng bộ tăng ca",
      "example": "我们需要加班同步。",
      "examplePinyin": "Wǒmen xūyào jiābān tóngbù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần đồng bộ tăng ca."
    },
    {
      "word": "加班搜索",
      "pinyin": "jiābān sōusuǒ",
      "meaning": "tìm kiếm tăng ca",
      "example": "我们需要加班搜索。",
      "examplePinyin": "Wǒmen xūyào jiābān sōusuǒ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tìm kiếm tăng ca."
    },
    {
      "word": "加班分类",
      "pinyin": "jiābān fēnlèi",
      "meaning": "phân loại tăng ca",
      "example": "我们需要加班分类。",
      "examplePinyin": "Wǒmen xūyào jiābān fēnlèi.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân loại tăng ca."
    },
    {
      "word": "加班统计",
      "pinyin": "jiābān tǒngjì",
      "meaning": "thống kê tăng ca",
      "example": "我们需要加班统计。",
      "examplePinyin": "Wǒmen xūyào jiābān tǒngjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thống kê tăng ca."
    },
    {
      "word": "加班确认",
      "pinyin": "jiābān quèrèn",
      "meaning": "xác nhận tăng ca",
      "example": "我们需要加班确认。",
      "examplePinyin": "Wǒmen xūyào jiābān quèrèn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xác nhận tăng ca."
    },
    {
      "word": "加班审核",
      "pinyin": "jiābān shěnhé",
      "meaning": "duyệt/kiểm duyệt tăng ca",
      "example": "我们需要加班审核。",
      "examplePinyin": "Wǒmen xūyào jiābān shěnhé.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần duyệt/kiểm duyệt tăng ca."
    },
    {
      "word": "加班测试",
      "pinyin": "jiābān cèshì",
      "meaning": "kiểm thử tăng ca",
      "example": "我们需要加班测试。",
      "examplePinyin": "Wǒmen xūyào jiābān cèshì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm thử tăng ca."
    },
    {
      "word": "加班维护",
      "pinyin": "jiābān wéihù",
      "meaning": "bảo trì tăng ca",
      "example": "我们需要加班维护。",
      "examplePinyin": "Wǒmen xūyào jiābān wéihù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bảo trì tăng ca."
    },
    {
      "word": "加班设计",
      "pinyin": "jiābān shèjì",
      "meaning": "thiết kế tăng ca",
      "example": "我们需要加班设计。",
      "examplePinyin": "Wǒmen xūyào jiābān shèjì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thiết kế tăng ca."
    },
    {
      "word": "加班开发",
      "pinyin": "jiābān kāifā",
      "meaning": "phát triển tăng ca",
      "example": "我们需要加班开发。",
      "examplePinyin": "Wǒmen xūyào jiābān kāifā.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phát triển tăng ca."
    },
    {
      "word": "加班训练",
      "pinyin": "jiābān xùnliàn",
      "meaning": "huấn luyện tăng ca",
      "example": "我们需要加班训练。",
      "examplePinyin": "Wǒmen xūyào jiābān xùnliàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần huấn luyện tăng ca."
    },
    {
      "word": "加班识别",
      "pinyin": "jiābān shíbié",
      "meaning": "nhận dạng tăng ca",
      "example": "我们需要加班识别。",
      "examplePinyin": "Wǒmen xūyào jiābān shíbié.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhận dạng tăng ca."
    },
    {
      "word": "加班生成",
      "pinyin": "jiābān shēngchéng",
      "meaning": "tạo sinh tăng ca",
      "example": "我们需要加班生成。",
      "examplePinyin": "Wǒmen xūyào jiābān shēngchéng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tạo sinh tăng ca."
    },
    {
      "word": "加班通知",
      "pinyin": "jiābān tōngzhī",
      "meaning": "thông báo tăng ca",
      "example": "我们需要加班通知。",
      "examplePinyin": "Wǒmen xūyào jiābān tōngzhī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần thông báo tăng ca."
    },
    {
      "word": "加班权限",
      "pinyin": "jiābān quánxiàn",
      "meaning": "quyền hạn tăng ca",
      "example": "我们需要加班权限。",
      "examplePinyin": "Wǒmen xūyào jiābān quánxiàn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quyền hạn tăng ca."
    },
    {
      "word": "加班状态",
      "pinyin": "jiābān zhuàngtài",
      "meaning": "trạng thái tăng ca",
      "example": "我们需要加班状态。",
      "examplePinyin": "Wǒmen xūyào jiābān zhuàngtài.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần trạng thái tăng ca."
    },
    {
      "word": "加班编号",
      "pinyin": "jiābān biānhào",
      "meaning": "mã số tăng ca",
      "example": "我们需要加班编号。",
      "examplePinyin": "Wǒmen xūyào jiābān biānhào.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mã số tăng ca."
    },
    {
      "word": "加班模板",
      "pinyin": "jiābān múbǎn",
      "meaning": "mẫu/template tăng ca",
      "example": "我们需要加班模板。",
      "examplePinyin": "Wǒmen xūyào jiābān múbǎn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần mẫu/template tăng ca."
    },
    {
      "word": "加班异常",
      "pinyin": "jiābān yìcháng",
      "meaning": "bất thường/lỗi tăng ca",
      "example": "我们需要加班异常。",
      "examplePinyin": "Wǒmen xūyào jiābān yìcháng.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần bất thường/lỗi tăng ca."
    },
    {
      "word": "请假管理",
      "pinyin": "qǐngjià guǎnlǐ",
      "meaning": "quản lý xin nghỉ phép",
      "example": "我们需要请假管理。",
      "examplePinyin": "Wǒmen xūyào qǐngjià guǎnlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần quản lý xin nghỉ phép."
    },
    {
      "word": "请假处理",
      "pinyin": "qǐngjià chǔlǐ",
      "meaning": "xử lý xin nghỉ phép",
      "example": "我们需要请假处理。",
      "examplePinyin": "Wǒmen xūyào qǐngjià chǔlǐ.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xử lý xin nghỉ phép."
    },
    {
      "word": "请假分析",
      "pinyin": "qǐngjià fēnxī",
      "meaning": "phân tích xin nghỉ phép",
      "example": "我们需要请假分析。",
      "examplePinyin": "Wǒmen xūyào qǐngjià fēnxī.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần phân tích xin nghỉ phép."
    },
    {
      "word": "请假检查",
      "pinyin": "qǐngjià jiǎnchá",
      "meaning": "kiểm tra xin nghỉ phép",
      "example": "我们需要请假检查。",
      "examplePinyin": "Wǒmen xūyào qǐngjià jiǎnchá.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần kiểm tra xin nghỉ phép."
    },
    {
      "word": "请假记录",
      "pinyin": "qǐngjià jìlù",
      "meaning": "ghi chép xin nghỉ phép",
      "example": "我们需要请假记录。",
      "examplePinyin": "Wǒmen xūyào qǐngjià jìlù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần ghi chép xin nghỉ phép."
    },
    {
      "word": "请假设置",
      "pinyin": "qǐngjià shèzhì",
      "meaning": "cài đặt xin nghỉ phép",
      "example": "我们需要请假设置。",
      "examplePinyin": "Wǒmen xūyào qǐngjià shèzhì.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cài đặt xin nghỉ phép."
    },
    {
      "word": "请假更新",
      "pinyin": "qǐngjià gēngxīn",
      "meaning": "cập nhật xin nghỉ phép",
      "example": "我们需要请假更新。",
      "examplePinyin": "Wǒmen xūyào qǐngjià gēngxīn.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần cập nhật xin nghỉ phép."
    },
    {
      "word": "请假优化",
      "pinyin": "qǐngjià yōuhuà",
      "meaning": "tối ưu hóa xin nghỉ phép",
      "example": "我们需要请假优化。",
      "examplePinyin": "Wǒmen xūyào qǐngjià yōuhuà.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần tối ưu hóa xin nghỉ phép."
    },
    {
      "word": "请假导入",
      "pinyin": "qǐngjià dǎorù",
      "meaning": "nhập vào xin nghỉ phép",
      "example": "我们需要请假导入。",
      "examplePinyin": "Wǒmen xūyào qǐngjià dǎorù.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần nhập vào xin nghỉ phép."
    },
    {
      "word": "请假导出",
      "pinyin": "qǐngjià dǎochū",
      "meaning": "xuất ra xin nghỉ phép",
      "example": "我们需要请假导出。",
      "examplePinyin": "Wǒmen xūyào qǐngjià dǎochū.",
      "fromType": "Danh từ/Cụm từ",
      "trans": "Chúng ta cần xuất ra xin nghỉ phép."
    }
  ]
};

const allVocabulary = Object.values(fullLibrary).flat();
function removeDuplicateWords(arr){ const seen=new Set(); return arr.filter(x=>{ const w=x && x.word; if(!w||seen.has(w)) return false; seen.add(w); return true; }); }
const allVocabularyClean = removeDuplicateWords(allVocabulary);
function searchVocabulary(keyword){ const q=String(keyword||'').trim().toLowerCase(); if(!q) return []; return allVocabularyClean.filter(item => String(item.word||'').toLowerCase().includes(q) || String(item.pinyin||'').toLowerCase().includes(q) || String(item.meaning||'').toLowerCase().includes(q)); }
if(typeof window!=='undefined'){ window.fullLibrary=fullLibrary; window.allVocabulary=allVocabularyClean; window.searchVocabulary=searchVocabulary; }
