const fs = require("fs");
const path = require("path");

// Load .env.local if exists
require("fs").existsSync(".env.local") &&
  require("fs").readFileSync(".env.local","utf8").split("\n").forEach(line=>{
    const [k,...v]=line.split("=");
    if(k&&v.length) process.env[k.trim()]=v.join("=").trim();
  });

const API_KEY = process.env.ANTHROPIC_API_KEY;
if(!API_KEY||API_KEY.includes("your-key")){
  console.error("\n❌  API key not set.\n");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname,"../public/data");
if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});

const ARTICLES = [
  {id:"preamble",num:"—",title:"Preamble to the Constitution",partName:"Preamble",partSubtitle:""},
  {id:"1",num:"1",title:"Name and territory of the Union",partName:"Part I",partSubtitle:"The Union and its Territory"},
  {id:"2",num:"2",title:"Admission or establishment of new States",partName:"Part I",partSubtitle:"The Union and its Territory"},
  {id:"3",num:"3",title:"Formation of new States and alteration of areas boundaries or names",partName:"Part I",partSubtitle:"The Union and its Territory"},
  {id:"4",num:"4",title:"Laws under Arts 2 and 3",partName:"Part I",partSubtitle:"The Union and its Territory"},
  {id:"5",num:"5",title:"Citizenship at commencement",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"6",num:"6",title:"Rights of citizenship of persons who migrated from Pakistan",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"7",num:"7",title:"Rights of citizenship of certain migrants to Pakistan",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"8",num:"8",title:"Rights of citizenship of persons of Indian origin outside India",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"9",num:"9",title:"Persons voluntarily acquiring foreign citizenship not to be citizens",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"10",num:"10",title:"Continuance of the rights of citizenship",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"11",num:"11",title:"Parliament to regulate the right of citizenship by law",partName:"Part II",partSubtitle:"Citizenship"},
  {id:"12",num:"12",title:"Definition of State",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"13",num:"13",title:"Laws inconsistent with or in derogation of Fundamental Rights",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"14",num:"14",title:"Equality before law",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"15",num:"15",title:"Prohibition of discrimination on grounds of religion race caste sex or place of birth",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"16",num:"16",title:"Equality of opportunity in matters of public employment",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"17",num:"17",title:"Abolition of Untouchability",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"18",num:"18",title:"Abolition of Titles",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"19",num:"19",title:"Protection of certain rights regarding freedom of speech etc",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"20",num:"20",title:"Protection in respect of conviction for offences",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"21",num:"21",title:"Protection of life and personal liberty",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"21A",num:"21A",title:"Right to Education",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"22",num:"22",title:"Protection against arrest and detention in certain cases",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"23",num:"23",title:"Prohibition of traffic in human beings and forced labour",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"24",num:"24",title:"Prohibition of employment of children in factories",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"25",num:"25",title:"Freedom of conscience and free profession practice and propagation of religion",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"26",num:"26",title:"Freedom to manage religious affairs",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"27",num:"27",title:"Freedom as to payment of taxes for promotion of any particular religion",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"28",num:"28",title:"Freedom as to attendance at religious instruction in certain educational institutions",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"29",num:"29",title:"Protection of interests of minorities",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"30",num:"30",title:"Right of minorities to establish and administer educational institutions",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"31A",num:"31A",title:"Saving of Laws providing for acquisition of estates",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"31B",num:"31B",title:"Validation of certain Acts and Regulations Ninth Schedule",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"31C",num:"31C",title:"Saving of laws giving effect to certain directive principles",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"32",num:"32",title:"Remedies for enforcement of rights conferred by this Part",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"33",num:"33",title:"Power of Parliament to modify rights in application to Armed Forces",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"34",num:"34",title:"Restriction on rights while martial law is in force",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"35",num:"35",title:"Legislation to give effect to the provisions of this Part",partName:"Part III",partSubtitle:"Fundamental Rights"},
  {id:"36",num:"36",title:"Definition",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"37",num:"37",title:"Application of the principles contained in this Part",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"38",num:"38",title:"State to secure a social order for promotion of welfare of the people",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"39",num:"39",title:"Certain principles of policy to be followed by the State",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"39A",num:"39A",title:"Equal justice and free legal aid",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"40",num:"40",title:"Organisation of village panchayats",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"41",num:"41",title:"Right to work to education and to public assistance in certain cases",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"42",num:"42",title:"Provision for just and humane conditions of work and maternity relief",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"43",num:"43",title:"Living wage for workers",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"43A",num:"43A",title:"Participation of workers in management of industries",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"43B",num:"43B",title:"Promotion of co-operative societies",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"44",num:"44",title:"Uniform civil code for the citizens",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"45",num:"45",title:"Provision for early childhood care and education to children below six years",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"46",num:"46",title:"Promotion of educational and economic interests of SCs STs and other weaker sections",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"47",num:"47",title:"Duty of the State to raise level of nutrition and standard of living",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"48",num:"48",title:"Organisation of agriculture and animal husbandry",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"48A",num:"48A",title:"Protection and improvement of environment and safeguarding of forests and wild life",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"49",num:"49",title:"Protection of monuments and places and objects of national importance",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"50",num:"50",title:"Separation of judiciary from executive",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"51",num:"51",title:"Promotion of international peace and security",partName:"Part IV",partSubtitle:"Directive Principles of State Policy"},
  {id:"51A",num:"51A",title:"Fundamental Duties",partName:"Part IVA",partSubtitle:"Fundamental Duties"},
  {id:"52",num:"52",title:"The President of India",partName:"Part V",partSubtitle:"The Union"},
  {id:"53",num:"53",title:"Executive power of the Union",partName:"Part V",partSubtitle:"The Union"},
  {id:"54",num:"54",title:"Election of President",partName:"Part V",partSubtitle:"The Union"},
  {id:"55",num:"55",title:"Manner of election of President",partName:"Part V",partSubtitle:"The Union"},
  {id:"56",num:"56",title:"Term of office of President",partName:"Part V",partSubtitle:"The Union"},
  {id:"57",num:"57",title:"Eligibility for re-election",partName:"Part V",partSubtitle:"The Union"},
  {id:"58",num:"58",title:"Qualifications for election as President",partName:"Part V",partSubtitle:"The Union"},
  {id:"60",num:"60",title:"Oath or affirmation by the President",partName:"Part V",partSubtitle:"The Union"},
  {id:"61",num:"61",title:"Procedure for impeachment of the President",partName:"Part V",partSubtitle:"The Union"},
  {id:"63",num:"63",title:"The Vice-President of India",partName:"Part V",partSubtitle:"The Union"},
  {id:"64",num:"64",title:"The Vice-President to be ex-officio Chairman of Rajya Sabha",partName:"Part V",partSubtitle:"The Union"},
  {id:"65",num:"65",title:"The Vice-President to act as President",partName:"Part V",partSubtitle:"The Union"},
  {id:"66",num:"66",title:"Election of Vice-President",partName:"Part V",partSubtitle:"The Union"},
  {id:"72",num:"72",title:"Power of President to grant pardons reprieves respites or remissions",partName:"Part V",partSubtitle:"The Union"},
  {id:"74",num:"74",title:"Council of Ministers to aid and advise President",partName:"Part V",partSubtitle:"The Union"},
  {id:"75",num:"75",title:"Other provisions as to Ministers",partName:"Part V",partSubtitle:"The Union"},
  {id:"76",num:"76",title:"Attorney-General for India",partName:"Part V",partSubtitle:"The Union"},
  {id:"78",num:"78",title:"Duties of Prime Minister as respects furnishing information to the President",partName:"Part V",partSubtitle:"The Union"},
  {id:"79",num:"79",title:"Constitution of Parliament",partName:"Part V",partSubtitle:"The Union"},
  {id:"80",num:"80",title:"Composition of the Council of States Rajya Sabha",partName:"Part V",partSubtitle:"The Union"},
  {id:"81",num:"81",title:"Composition of the House of the People Lok Sabha",partName:"Part V",partSubtitle:"The Union"},
  {id:"83",num:"83",title:"Duration of Houses of Parliament",partName:"Part V",partSubtitle:"The Union"},
  {id:"84",num:"84",title:"Qualification for membership of Parliament",partName:"Part V",partSubtitle:"The Union"},
  {id:"85",num:"85",title:"Sessions of Parliament prorogation and dissolution",partName:"Part V",partSubtitle:"The Union"},
  {id:"93",num:"93",title:"The Speaker and Deputy Speaker of the House of the People",partName:"Part V",partSubtitle:"The Union"},
  {id:"100",num:"100",title:"Voting in Houses power of Houses to act notwithstanding vacancies and quorum",partName:"Part V",partSubtitle:"The Union"},
  {id:"101",num:"101",title:"Vacation of seats",partName:"Part V",partSubtitle:"The Union"},
  {id:"102",num:"102",title:"Disqualifications for membership",partName:"Part V",partSubtitle:"The Union"},
  {id:"103",num:"103",title:"Decision on questions as to disqualifications of members",partName:"Part V",partSubtitle:"The Union"},
  {id:"105",num:"105",title:"Powers privileges of the Houses of Parliament and of the members",partName:"Part V",partSubtitle:"The Union"},
  {id:"108",num:"108",title:"Joint sitting of both Houses in certain cases",partName:"Part V",partSubtitle:"The Union"},
  {id:"109",num:"109",title:"Special procedure in respect of Money Bills",partName:"Part V",partSubtitle:"The Union"},
  {id:"110",num:"110",title:"Definition of Money Bills",partName:"Part V",partSubtitle:"The Union"},
  {id:"111",num:"111",title:"Assent to Bills",partName:"Part V",partSubtitle:"The Union"},
  {id:"112",num:"112",title:"Annual Financial Statement Union Budget",partName:"Part V",partSubtitle:"The Union"},
  {id:"114",num:"114",title:"Appropriation Bills",partName:"Part V",partSubtitle:"The Union"},
  {id:"123",num:"123",title:"Power of President to promulgate Ordinances during recess of Parliament",partName:"Part V",partSubtitle:"The Union"},
  {id:"124",num:"124",title:"Establishment and constitution of Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"129",num:"129",title:"Supreme Court to be a court of record",partName:"Part V",partSubtitle:"The Union"},
  {id:"131",num:"131",title:"Original jurisdiction of the Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"136",num:"136",title:"Special leave to appeal by the Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"137",num:"137",title:"Review of judgments or orders by the Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"141",num:"141",title:"Law declared by Supreme Court to be binding on all courts",partName:"Part V",partSubtitle:"The Union"},
  {id:"142",num:"142",title:"Enforcement of decrees and orders of Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"143",num:"143",title:"Power of President to consult Supreme Court",partName:"Part V",partSubtitle:"The Union"},
  {id:"148",num:"148",title:"Comptroller and Auditor-General of India",partName:"Part V",partSubtitle:"The Union"},
  {id:"151",num:"151",title:"Audit reports",partName:"Part V",partSubtitle:"The Union"},
  {id:"152",num:"152",title:"Definition",partName:"Part VI",partSubtitle:"The States"},
  {id:"153",num:"153",title:"Governors of States",partName:"Part VI",partSubtitle:"The States"},
  {id:"154",num:"154",title:"Executive power of State",partName:"Part VI",partSubtitle:"The States"},
  {id:"155",num:"155",title:"Appointment of Governor",partName:"Part VI",partSubtitle:"The States"},
  {id:"156",num:"156",title:"Term of office of Governor",partName:"Part VI",partSubtitle:"The States"},
  {id:"161",num:"161",title:"Power of Governor to grant pardons etc",partName:"Part VI",partSubtitle:"The States"},
  {id:"163",num:"163",title:"Council of Ministers to aid and advise Governor",partName:"Part VI",partSubtitle:"The States"},
  {id:"164",num:"164",title:"Other provisions as to Ministers",partName:"Part VI",partSubtitle:"The States"},
  {id:"165",num:"165",title:"Advocate-General for the State",partName:"Part VI",partSubtitle:"The States"},
  {id:"167",num:"167",title:"Duties of Chief Minister as respects furnishing information to Governor",partName:"Part VI",partSubtitle:"The States"},
  {id:"168",num:"168",title:"Constitution of Legislatures in States",partName:"Part VI",partSubtitle:"The States"},
  {id:"169",num:"169",title:"Abolition or creation of Legislative Councils in States",partName:"Part VI",partSubtitle:"The States"},
  {id:"170",num:"170",title:"Composition of the Legislative Assemblies",partName:"Part VI",partSubtitle:"The States"},
  {id:"171",num:"171",title:"Composition of the Legislative Councils",partName:"Part VI",partSubtitle:"The States"},
  {id:"172",num:"172",title:"Duration of State Legislatures",partName:"Part VI",partSubtitle:"The States"},
  {id:"213",num:"213",title:"Power of Governor to promulgate Ordinances during recess of Legislature",partName:"Part VI",partSubtitle:"The States"},
  {id:"214",num:"214",title:"High Courts for States",partName:"Part VI",partSubtitle:"The States"},
  {id:"217",num:"217",title:"Appointment and conditions of the office of a Judge of a High Court",partName:"Part VI",partSubtitle:"The States"},
  {id:"226",num:"226",title:"Power of High Courts to issue certain writs",partName:"Part VI",partSubtitle:"The States"},
  {id:"227",num:"227",title:"Power of superintendence over all courts by the High Court",partName:"Part VI",partSubtitle:"The States"},
  {id:"239",num:"239",title:"Administration of Union territories",partName:"Part VIII",partSubtitle:"The Union Territories"},
  {id:"239AA",num:"239AA",title:"Special provisions with respect to Delhi",partName:"Part VIII",partSubtitle:"The Union Territories"},
  {id:"240",num:"240",title:"Power of President to make regulations for certain Union territories",partName:"Part VIII",partSubtitle:"The Union Territories"},
  {id:"243",num:"243",title:"Definitions",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243A",num:"243A",title:"Gram Sabha",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243B",num:"243B",title:"Constitution of Panchayats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243C",num:"243C",title:"Composition of Panchayats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243D",num:"243D",title:"Reservation of seats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243E",num:"243E",title:"Duration of Panchayats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243G",num:"243G",title:"Powers authority and responsibilities of Panchayats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243K",num:"243K",title:"Elections to the Panchayats",partName:"Part IX",partSubtitle:"The Panchayats"},
  {id:"243P",num:"243P",title:"Definitions",partName:"Part IXA",partSubtitle:"The Municipalities"},
  {id:"243Q",num:"243Q",title:"Constitution of Municipalities",partName:"Part IXA",partSubtitle:"The Municipalities"},
  {id:"243T",num:"243T",title:"Reservation of seats",partName:"Part IXA",partSubtitle:"The Municipalities"},
  {id:"243W",num:"243W",title:"Powers authority and responsibilities of Municipalities",partName:"Part IXA",partSubtitle:"The Municipalities"},
  {id:"245",num:"245",title:"Extent of laws made by Parliament and by the Legislatures of States",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"246",num:"246",title:"Subject-matter of laws made by Parliament and by the Legislatures of States",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"246A",num:"246A",title:"Special provision with respect to goods and services tax",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"248",num:"248",title:"Residuary powers of legislation",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"249",num:"249",title:"Power of Parliament to legislate with respect to a matter in the State List in the national interest",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"252",num:"252",title:"Power of Parliament to legislate for two or more States by consent",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"253",num:"253",title:"Legislation for giving effect to international agreements",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"254",num:"254",title:"Inconsistency between laws made by Parliament and laws made by Legislatures of States",partName:"Part XI",partSubtitle:"Relations between the Union and the States"},
  {id:"265",num:"265",title:"Taxes not to be imposed save by authority of law",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"266",num:"266",title:"Consolidated Funds and public accounts of India and of the States",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"267",num:"267",title:"Contingency Fund",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"270",num:"270",title:"Taxes levied and distributed between the Union and the States",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"279A",num:"279A",title:"Goods and Services Tax Council",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"280",num:"280",title:"Finance Commission",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"300A",num:"300A",title:"Persons not to be deprived of property save by authority of law",partName:"Part XII",partSubtitle:"Finance Property Contracts and Suits"},
  {id:"309",num:"309",title:"Recruitment and conditions of service of persons serving the Union or a State",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"310",num:"310",title:"Tenure of office of persons serving the Union or a State",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"311",num:"311",title:"Dismissal removal or reduction in rank of persons employed in civil capacities",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"312",num:"312",title:"All-India services",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"315",num:"315",title:"Public Service Commissions for the Union and for the States",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"320",num:"320",title:"Functions of Public Service Commissions",partName:"Part XIV",partSubtitle:"Services under the Union and the States"},
  {id:"323A",num:"323A",title:"Administrative tribunals",partName:"Part XIVA",partSubtitle:"Tribunals"},
  {id:"323B",num:"323B",title:"Tribunals for other matters",partName:"Part XIVA",partSubtitle:"Tribunals"},
  {id:"324",num:"324",title:"Superintendence direction and control of elections vested in an Election Commission",partName:"Part XV",partSubtitle:"Elections"},
  {id:"325",num:"325",title:"No person to be ineligible for inclusion in electoral roll on grounds of religion race caste or sex",partName:"Part XV",partSubtitle:"Elections"},
  {id:"326",num:"326",title:"Elections on the basis of adult suffrage",partName:"Part XV",partSubtitle:"Elections"},
  {id:"329",num:"329",title:"Bar to interference by courts in electoral matters",partName:"Part XV",partSubtitle:"Elections"},
  {id:"330",num:"330",title:"Reservation of seats for SCs and STs in the House of the People",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"332",num:"332",title:"Reservation of seats for SCs and STs in the Legislative Assemblies of the States",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"335",num:"335",title:"Claims of Scheduled Castes and Scheduled Tribes to services and posts",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"338",num:"338",title:"National Commission for Scheduled Castes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"338A",num:"338A",title:"National Commission for Scheduled Tribes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"338B",num:"338B",title:"National Commission for Backward Classes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"340",num:"340",title:"Appointment of a Commission to investigate the conditions of backward classes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"341",num:"341",title:"Scheduled Castes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"342",num:"342",title:"Scheduled Tribes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"342A",num:"342A",title:"Socially and educationally backward classes",partName:"Part XVI",partSubtitle:"Special Provisions Relating to Certain Classes"},
  {id:"343",num:"343",title:"Official language of the Union",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"344",num:"344",title:"Commission and Committee of Parliament on official language",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"345",num:"345",title:"Official language or languages of a State",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"348",num:"348",title:"Language to be used in the Supreme Court and in the High Courts",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"350A",num:"350A",title:"Facilities for instruction in mother-tongue at primary stage",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"351",num:"351",title:"Directive for development of the Hindi language",partName:"Part XVII",partSubtitle:"Official Language"},
  {id:"352",num:"352",title:"Proclamation of Emergency National Emergency",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"353",num:"353",title:"Effect of Proclamation of Emergency",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"355",num:"355",title:"Duty of the Union to protect States against external aggression and internal disturbance",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"356",num:"356",title:"Provisions in case of failure of constitutional machinery in States Presidents Rule",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"357",num:"357",title:"Exercise of legislative powers under Proclamation issued under Article 356",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"358",num:"358",title:"Suspension of provisions of Article 19 during emergencies",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"359",num:"359",title:"Suspension of the enforcement of the rights conferred by Part III during emergencies",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"360",num:"360",title:"Provisions as to Financial Emergency",partName:"Part XVIII",partSubtitle:"Emergency Provisions"},
  {id:"368",num:"368",title:"Power of Parliament to amend the Constitution and procedure therefor",partName:"Part XX",partSubtitle:"Amendment of the Constitution"},
  {id:"370",num:"370",title:"Temporary provisions with respect to the State of Jammu and Kashmir",partName:"Part XXI",partSubtitle:"Temporary Transitional and Special Provisions"},
  {id:"371",num:"371",title:"Special provision with respect to the States of Maharashtra and Gujarat",partName:"Part XXI",partSubtitle:"Temporary Transitional and Special Provisions"},
  {id:"371A",num:"371A",title:"Special provision with respect to the State of Nagaland",partName:"Part XXI",partSubtitle:"Temporary Transitional and Special Provisions"},
  {id:"371F",num:"371F",title:"Special provisions with respect to the State of Sikkim",partName:"Part XXI",partSubtitle:"Temporary Transitional and Special Provisions"},
  {id:"371J",num:"371J",title:"Special provisions with respect to the State of Karnataka",partName:"Part XXI",partSubtitle:"Temporary Transitional and Special Provisions"},
  {id:"393",num:"393",title:"Short title",partName:"Part XXII",partSubtitle:"Short Title Commencement and Repeals"},
  {id:"394",num:"394",title:"Commencement",partName:"Part XXII",partSubtitle:"Short Title Commencement and Repeals"},
  {id:"395",num:"395",title:"Repeals",partName:"Part XXII",partSubtitle:"Short Title Commencement and Repeals"},
];

function buildPrompt(article) {
  return `You are an expert constitutional law scholar and UPSC Civil Services Examination coach.

Provide complete educational content for:
Article ${article.num==="—"?"Preamble":article.num}: "${article.title}"
${article.partName}${article.partSubtitle?" — "+article.partSubtitle:""}

Return ONLY valid JSON (no markdown, no code fences, no extra text):

{
  "articleText": "The complete verbatim text of this constitutional provision with all clauses and sub-clauses.",
  "summary": "3-4 sentence plain-language explanation of what this provision means and its constitutional importance.",
  "keyPoints": ["UPSC fact 1","UPSC fact 2","UPSC fact 3","UPSC fact 4","UPSC fact 5"],
  "amendments": ["Amendment history or This article has not been amended"],
  "judgements": [
    {
      "caseName": "Full case name v Other Party",
      "court": "Supreme Court of India",
      "year": 1973,
      "citation": "AIR citation",
      "significance": "2-3 sentences on why this case is landmark for this article.",
      "keyHolding": "The precise legal principle established"
    }
  ],
  "upscQuestions": [
    {
      "question": "Complete UPSC Prelims style question",
      "options": ["(a) Option 1","(b) Option 2","(c) Option 3","(d) Option 4"],
      "correctAnswer": "a",
      "explanation": "Why correct answer is right and why others are wrong.",
      "yearAsked": 2019
    }
  ]
}

Rules: 3-5 real landmark judgements. 4-5 UPSC questions. correctAnswer must be exactly a b c or d. yearAsked null if created.`;
}

async function callGemini(article, attempt=1) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const res = await fetch(url, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      contents:[{parts:[{text:buildPrompt(article)}]}],
      generationConfig:{temperature:0.7,maxOutputTokens:4000}
    })
  });

  if(res.status===429||res.status>=500){
    if(attempt<=4){
      const wait=attempt*15000;
      console.log(`    ⏳ Rate limited. Waiting ${wait/1000}s...`);
      await new Promise(r=>setTimeout(r,wait));
      return callGemini(article,attempt+1);
    }
    throw new Error(`HTTP ${res.status} after 4 attempts`);
  }

  if(!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if(data.error) throw new Error(data.error.message);

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text||"";
  const start=raw.indexOf("{");
  const end=raw.lastIndexOf("}");
  if(start===-1||end===-1) throw new Error("No JSON in response");
  return JSON.parse(raw.slice(start,end+1));
}

function bar(done,total,width=30){
  const filled=Math.round((done/total)*width);
  return "[" + "█".repeat(filled)+"░".repeat(width-filled)+"]";
}

async function main(){
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║  Samvidhan — One-Time Content Generator          ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const total=ARTICLES.length;
  const existing=fs.readdirSync(OUT_DIR).filter(f=>f.endsWith(".json")).length;
  console.log(`📁 Output: ${OUT_DIR}`);
  console.log(`📜 Total articles: ${total}`);
  console.log(`✅ Already done: ${existing}`);
  console.log(`🔄 Remaining: ${total-existing}\n`);

  if(existing===total){
    console.log("🎉 All articles already generated!\n");
    return;
  }

  let done=existing;
  let failed=[];

  for(let i=0;i<ARTICLES.length;i++){
    const article=ARTICLES[i];
    const filePath=path.join(OUT_DIR,`${article.id}.json`);
    if(fs.existsSync(filePath)) continue;

    const label=article.num==="—"?"Preamble":`Art. ${article.num}`;
    process.stdout.write(`\r${bar(done,total)} ${done}/${total}  Generating ${label.padEnd(12)}...`);

    try{
      const data=await callGemini(article);
      fs.writeFileSync(filePath,JSON.stringify(data,null,2),"utf8");
      done++;
      await new Promise(r=>setTimeout(r,1000));
    }catch(err){
      console.log(`\n  ⚠️  Failed: ${label} — ${err.message}`);
      failed.push(article.id);
      await new Promise(r=>setTimeout(r,3000));
    }
  }

  console.log(`\n\n╔══════════════════════════════════════════════════╗`);
  console.log(`║  GENERATION COMPLETE                             ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);
  console.log(`✅ Successfully generated: ${done}`);
  if(failed.length){
    console.log(`⚠️  Failed (${failed.length}): ${failed.join(", ")}`);
    console.log(`   Re-run "npm run generate" to retry failed articles.`);
  }
  console.log(`\n🚀 Next step: commit public/data/ to GitHub, then deploy to Vercel.\n`);
}

main().catch(err=>{
  console.error("\n❌ Fatal error:",err.message);
  process.exit(1);
});
