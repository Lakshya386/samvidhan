import { useState, useCallback } from "react";
import Head from "next/head";
import path from "path";
import fs from "fs";

// ══════════════════════════════════════════════════════════════════
// CONSTITUTION STRUCTURE
// ══════════════════════════════════════════════════════════════════
const CONSTITUTION_DATA = [
  { partId:"preamble", partName:"Preamble", partSubtitle:"", articles:[
    { id:"preamble", num:"—", title:"Preamble to the Constitution" },
  ]},
  { partId:"part1", partName:"Part I", partSubtitle:"The Union and its Territory", articles:[
    { id:"1", num:"1", title:"Name and territory of the Union" },
    { id:"2", num:"2", title:"Admission or establishment of new States" },
    { id:"3", num:"3", title:"Formation of new States and alteration of areas, boundaries or names" },
    { id:"4", num:"4", title:"Laws under Arts. 2 & 3 — amendment of First and Fourth Schedules" },
  ]},
  { partId:"part2", partName:"Part II", partSubtitle:"Citizenship", articles:[
    { id:"5",  num:"5",  title:"Citizenship at commencement of the Constitution" },
    { id:"6",  num:"6",  title:"Rights of citizenship of persons who migrated from Pakistan" },
    { id:"7",  num:"7",  title:"Rights of citizenship of certain migrants to Pakistan" },
    { id:"8",  num:"8",  title:"Rights of citizenship of persons of Indian origin residing outside India" },
    { id:"9",  num:"9",  title:"Persons voluntarily acquiring foreign citizenship not to be citizens" },
    { id:"10", num:"10", title:"Continuance of the rights of citizenship" },
    { id:"11", num:"11", title:"Parliament to regulate the right of citizenship by law" },
  ]},
  { partId:"part3", partName:"Part III", partSubtitle:"Fundamental Rights", articles:[
    { id:"12",  num:"12",  title:"Definition of 'State'" },
    { id:"13",  num:"13",  title:"Laws inconsistent with or in derogation of Fundamental Rights" },
    { id:"14",  num:"14",  title:"Equality before law" },
    { id:"15",  num:"15",  title:"Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth" },
    { id:"16",  num:"16",  title:"Equality of opportunity in matters of public employment" },
    { id:"17",  num:"17",  title:"Abolition of Untouchability" },
    { id:"18",  num:"18",  title:"Abolition of Titles" },
    { id:"19",  num:"19",  title:"Protection of certain rights regarding freedom of speech, etc." },
    { id:"20",  num:"20",  title:"Protection in respect of conviction for offences" },
    { id:"21",  num:"21",  title:"Protection of life and personal liberty" },
    { id:"21A", num:"21A", title:"Right to Education" },
    { id:"22",  num:"22",  title:"Protection against arrest and detention in certain cases" },
    { id:"23",  num:"23",  title:"Prohibition of traffic in human beings and forced labour" },
    { id:"24",  num:"24",  title:"Prohibition of employment of children in factories, etc." },
    { id:"25",  num:"25",  title:"Freedom of conscience and free profession, practice and propagation of religion" },
    { id:"26",  num:"26",  title:"Freedom to manage religious affairs" },
    { id:"27",  num:"27",  title:"Freedom as to payment of taxes for promotion of any particular religion" },
    { id:"28",  num:"28",  title:"Freedom as to attendance at religious instruction in certain educational institutions" },
    { id:"29",  num:"29",  title:"Protection of interests of minorities" },
    { id:"30",  num:"30",  title:"Right of minorities to establish and administer educational institutions" },
    { id:"31A", num:"31A", title:"Saving of Laws providing for acquisition of estates, etc." },
    { id:"31B", num:"31B", title:"Validation of certain Acts and Regulations (Ninth Schedule)" },
    { id:"31C", num:"31C", title:"Saving of laws giving effect to certain directive principles" },
    { id:"32",  num:"32",  title:"Remedies for enforcement of rights conferred by this Part" },
    { id:"33",  num:"33",  title:"Power of Parliament to modify rights in application to Armed Forces" },
    { id:"34",  num:"34",  title:"Restriction on rights while martial law is in force" },
    { id:"35",  num:"35",  title:"Legislation to give effect to the provisions of this Part" },
  ]},
  { partId:"part4", partName:"Part IV", partSubtitle:"Directive Principles of State Policy", articles:[
    { id:"36",  num:"36",  title:"Definition" },
    { id:"37",  num:"37",  title:"Application of the principles contained in this Part" },
    { id:"38",  num:"38",  title:"State to secure a social order for the promotion of welfare of the people" },
    { id:"39",  num:"39",  title:"Certain principles of policy to be followed by the State" },
    { id:"39A", num:"39A", title:"Equal justice and free legal aid" },
    { id:"40",  num:"40",  title:"Organisation of village panchayats" },
    { id:"41",  num:"41",  title:"Right to work, to education and to public assistance in certain cases" },
    { id:"42",  num:"42",  title:"Provision for just and humane conditions of work and maternity relief" },
    { id:"43",  num:"43",  title:"Living wage, etc., for workers" },
    { id:"43A", num:"43A", title:"Participation of workers in management of industries" },
    { id:"43B", num:"43B", title:"Promotion of co-operative societies" },
    { id:"44",  num:"44",  title:"Uniform civil code for the citizens" },
    { id:"45",  num:"45",  title:"Provision for early childhood care and education to children below six years" },
    { id:"46",  num:"46",  title:"Promotion of educational and economic interests of SCs, STs and other weaker sections" },
    { id:"47",  num:"47",  title:"Duty of the State to raise level of nutrition and standard of living" },
    { id:"48",  num:"48",  title:"Organisation of agriculture and animal husbandry" },
    { id:"48A", num:"48A", title:"Protection and improvement of environment and safeguarding of forests and wild life" },
    { id:"49",  num:"49",  title:"Protection of monuments and places and objects of national importance" },
    { id:"50",  num:"50",  title:"Separation of judiciary from executive" },
    { id:"51",  num:"51",  title:"Promotion of international peace and security" },
  ]},
  { partId:"part4A", partName:"Part IVA", partSubtitle:"Fundamental Duties", articles:[
    { id:"51A", num:"51A", title:"Fundamental Duties" },
  ]},
  { partId:"part5", partName:"Part V", partSubtitle:"The Union", articles:[
    { id:"52",  num:"52",  title:"The President of India" },
    { id:"53",  num:"53",  title:"Executive power of the Union" },
    { id:"54",  num:"54",  title:"Election of President" },
    { id:"55",  num:"55",  title:"Manner of election of President" },
    { id:"56",  num:"56",  title:"Term of office of President" },
    { id:"57",  num:"57",  title:"Eligibility for re-election" },
    { id:"58",  num:"58",  title:"Qualifications for election as President" },
    { id:"60",  num:"60",  title:"Oath or affirmation by the President" },
    { id:"61",  num:"61",  title:"Procedure for impeachment of the President" },
    { id:"63",  num:"63",  title:"The Vice-President of India" },
    { id:"64",  num:"64",  title:"The Vice-President to be ex-officio Chairman of Rajya Sabha" },
    { id:"65",  num:"65",  title:"The Vice-President to act as President or discharge his functions" },
    { id:"66",  num:"66",  title:"Election of Vice-President" },
    { id:"72",  num:"72",  title:"Power of President to grant pardons, reprieves, respites or remissions" },
    { id:"74",  num:"74",  title:"Council of Ministers to aid and advise President" },
    { id:"75",  num:"75",  title:"Other provisions as to Ministers" },
    { id:"76",  num:"76",  title:"Attorney-General for India" },
    { id:"78",  num:"78",  title:"Duties of Prime Minister as respects furnishing information to the President" },
    { id:"79",  num:"79",  title:"Constitution of Parliament" },
    { id:"80",  num:"80",  title:"Composition of the Council of States (Rajya Sabha)" },
    { id:"81",  num:"81",  title:"Composition of the House of the People (Lok Sabha)" },
    { id:"83",  num:"83",  title:"Duration of Houses of Parliament" },
    { id:"84",  num:"84",  title:"Qualification for membership of Parliament" },
    { id:"85",  num:"85",  title:"Sessions of Parliament, prorogation and dissolution" },
    { id:"93",  num:"93",  title:"The Speaker and Deputy Speaker of the House of the People" },
    { id:"100", num:"100", title:"Voting in Houses, power of Houses to act notwithstanding vacancies and quorum" },
    { id:"101", num:"101", title:"Vacation of seats" },
    { id:"102", num:"102", title:"Disqualifications for membership" },
    { id:"103", num:"103", title:"Decision on questions as to disqualifications of members" },
    { id:"105", num:"105", title:"Powers, privileges, etc., of the Houses of Parliament and of the members" },
    { id:"108", num:"108", title:"Joint sitting of both Houses in certain cases" },
    { id:"109", num:"109", title:"Special procedure in respect of Money Bills" },
    { id:"110", num:"110", title:"Definition of 'Money Bills'" },
    { id:"111", num:"111", title:"Assent to Bills" },
    { id:"112", num:"112", title:"Annual Financial Statement (Union Budget)" },
    { id:"114", num:"114", title:"Appropriation Bills" },
    { id:"123", num:"123", title:"Power of President to promulgate Ordinances during recess of Parliament" },
    { id:"124", num:"124", title:"Establishment and constitution of Supreme Court" },
    { id:"129", num:"129", title:"Supreme Court to be a court of record" },
    { id:"131", num:"131", title:"Original jurisdiction of the Supreme Court" },
    { id:"136", num:"136", title:"Special leave to appeal by the Supreme Court" },
    { id:"137", num:"137", title:"Review of judgments or orders by the Supreme Court" },
    { id:"141", num:"141", title:"Law declared by Supreme Court to be binding on all courts" },
    { id:"142", num:"142", title:"Enforcement of decrees and orders of Supreme Court" },
    { id:"143", num:"143", title:"Power of President to consult Supreme Court" },
    { id:"148", num:"148", title:"Comptroller and Auditor-General of India" },
    { id:"151", num:"151", title:"Audit reports" },
  ]},
  { partId:"part6", partName:"Part VI", partSubtitle:"The States", articles:[
    { id:"152", num:"152", title:"Definition" },
    { id:"153", num:"153", title:"Governors of States" },
    { id:"154", num:"154", title:"Executive power of State" },
    { id:"155", num:"155", title:"Appointment of Governor" },
    { id:"156", num:"156", title:"Term of office of Governor" },
    { id:"161", num:"161", title:"Power of Governor to grant pardons, etc." },
    { id:"163", num:"163", title:"Council of Ministers to aid and advise Governor" },
    { id:"164", num:"164", title:"Other provisions as to Ministers" },
    { id:"165", num:"165", title:"Advocate-General for the State" },
    { id:"167", num:"167", title:"Duties of Chief Minister as respects furnishing information to Governor" },
    { id:"168", num:"168", title:"Constitution of Legislatures in States" },
    { id:"169", num:"169", title:"Abolition or creation of Legislative Councils in States" },
    { id:"170", num:"170", title:"Composition of the Legislative Assemblies" },
    { id:"171", num:"171", title:"Composition of the Legislative Councils" },
    { id:"172", num:"172", title:"Duration of State Legislatures" },
    { id:"213", num:"213", title:"Power of Governor to promulgate Ordinances during recess of Legislature" },
    { id:"214", num:"214", title:"High Courts for States" },
    { id:"217", num:"217", title:"Appointment and conditions of the office of a Judge of a High Court" },
    { id:"226", num:"226", title:"Power of High Courts to issue certain writs" },
    { id:"227", num:"227", title:"Power of superintendence over all courts by the High Court" },
  ]},
  { partId:"part8", partName:"Part VIII", partSubtitle:"The Union Territories", articles:[
    { id:"239",   num:"239",   title:"Administration of Union territories" },
    { id:"239AA", num:"239AA", title:"Special provisions with respect to Delhi" },
    { id:"240",   num:"240",   title:"Power of President to make regulations for certain Union territories" },
  ]},
  { partId:"part9", partName:"Part IX", partSubtitle:"The Panchayats (73rd Amendment)", articles:[
    { id:"243",  num:"243",  title:"Definitions" },
    { id:"243A", num:"243A", title:"Gram Sabha" },
    { id:"243B", num:"243B", title:"Constitution of Panchayats" },
    { id:"243C", num:"243C", title:"Composition of Panchayats" },
    { id:"243D", num:"243D", title:"Reservation of seats" },
    { id:"243E", num:"243E", title:"Duration of Panchayats, etc." },
    { id:"243G", num:"243G", title:"Powers, authority and responsibilities of Panchayats" },
    { id:"243K", num:"243K", title:"Elections to the Panchayats" },
  ]},
  { partId:"part9A", partName:"Part IXA", partSubtitle:"The Municipalities (74th Amendment)", articles:[
    { id:"243P", num:"243P", title:"Definitions" },
    { id:"243Q", num:"243Q", title:"Constitution of Municipalities" },
    { id:"243T", num:"243T", title:"Reservation of seats" },
    { id:"243W", num:"243W", title:"Powers, authority and responsibilities of Municipalities" },
  ]},
  { partId:"part11", partName:"Part XI", partSubtitle:"Relations between the Union and the States", articles:[
    { id:"245",  num:"245",  title:"Extent of laws made by Parliament and by the Legislatures of States" },
    { id:"246",  num:"246",  title:"Subject-matter of laws made by Parliament and by the Legislatures of States" },
    { id:"246A", num:"246A", title:"Special provision with respect to goods and services tax" },
    { id:"248",  num:"248",  title:"Residuary powers of legislation" },
    { id:"249",  num:"249",  title:"Power of Parliament to legislate with respect to a matter in the State List in the national interest" },
    { id:"252",  num:"252",  title:"Power of Parliament to legislate for two or more States by consent" },
    { id:"253",  num:"253",  title:"Legislation for giving effect to international agreements" },
    { id:"254",  num:"254",  title:"Inconsistency between laws made by Parliament and laws made by Legislatures of States" },
  ]},
  { partId:"part12", partName:"Part XII", partSubtitle:"Finance, Property, Contracts and Suits", articles:[
    { id:"265",  num:"265",  title:"Taxes not to be imposed save by authority of law" },
    { id:"266",  num:"266",  title:"Consolidated Funds and public accounts of India and of the States" },
    { id:"267",  num:"267",  title:"Contingency Fund" },
    { id:"270",  num:"270",  title:"Taxes levied and distributed between the Union and the States" },
    { id:"279A", num:"279A", title:"Goods and Services Tax Council" },
    { id:"280",  num:"280",  title:"Finance Commission" },
    { id:"300A", num:"300A", title:"Persons not to be deprived of property save by authority of law" },
  ]},
  { partId:"part14", partName:"Part XIV", partSubtitle:"Services under the Union and the States", articles:[
    { id:"309", num:"309", title:"Recruitment and conditions of service of persons serving the Union or a State" },
    { id:"310", num:"310", title:"Tenure of office of persons serving the Union or a State" },
    { id:"311", num:"311", title:"Dismissal, removal or reduction in rank of persons employed in civil capacities" },
    { id:"312", num:"312", title:"All-India services" },
    { id:"315", num:"315", title:"Public Service Commissions for the Union and for the States" },
    { id:"320", num:"320", title:"Functions of Public Service Commissions" },
  ]},
  { partId:"part14A", partName:"Part XIVA", partSubtitle:"Tribunals", articles:[
    { id:"323A", num:"323A", title:"Administrative tribunals" },
    { id:"323B", num:"323B", title:"Tribunals for other matters" },
  ]},
  { partId:"part15", partName:"Part XV", partSubtitle:"Elections", articles:[
    { id:"324", num:"324", title:"Superintendence, direction and control of elections vested in an Election Commission" },
    { id:"325", num:"325", title:"No person to be ineligible for inclusion in electoral roll on grounds of religion, race, caste or sex" },
    { id:"326", num:"326", title:"Elections on the basis of adult suffrage" },
    { id:"329", num:"329", title:"Bar to interference by courts in electoral matters" },
  ]},
  { partId:"part16", partName:"Part XVI", partSubtitle:"Special Provisions Relating to Certain Classes", articles:[
    { id:"330",  num:"330",  title:"Reservation of seats for SCs and STs in the House of the People" },
    { id:"332",  num:"332",  title:"Reservation of seats for SCs and STs in the Legislative Assemblies of the States" },
    { id:"335",  num:"335",  title:"Claims of Scheduled Castes and Scheduled Tribes to services and posts" },
    { id:"338",  num:"338",  title:"National Commission for Scheduled Castes" },
    { id:"338A", num:"338A", title:"National Commission for Scheduled Tribes" },
    { id:"338B", num:"338B", title:"National Commission for Backward Classes" },
    { id:"340",  num:"340",  title:"Appointment of a Commission to investigate the conditions of backward classes" },
    { id:"341",  num:"341",  title:"Scheduled Castes" },
    { id:"342",  num:"342",  title:"Scheduled Tribes" },
    { id:"342A", num:"342A", title:"Socially and educationally backward classes" },
  ]},
  { partId:"part17", partName:"Part XVII", partSubtitle:"Official Language", articles:[
    { id:"343",  num:"343",  title:"Official language of the Union" },
    { id:"344",  num:"344",  title:"Commission and Committee of Parliament on official language" },
    { id:"345",  num:"345",  title:"Official language or languages of a State" },
    { id:"348",  num:"348",  title:"Language to be used in the Supreme Court and in the High Courts" },
    { id:"350A", num:"350A", title:"Facilities for instruction in mother-tongue at primary stage" },
    { id:"351",  num:"351",  title:"Directive for development of the Hindi language" },
  ]},
  { partId:"part18", partName:"Part XVIII", partSubtitle:"Emergency Provisions", articles:[
    { id:"352", num:"352", title:"Proclamation of Emergency (National Emergency)" },
    { id:"353", num:"353", title:"Effect of Proclamation of Emergency" },
    { id:"355", num:"355", title:"Duty of the Union to protect States against external aggression and internal disturbance" },
    { id:"356", num:"356", title:"Provisions in case of failure of constitutional machinery in States (President's Rule)" },
    { id:"357", num:"357", title:"Exercise of legislative powers under Proclamation issued under Article 356" },
    { id:"358", num:"358", title:"Suspension of provisions of Article 19 during emergencies" },
    { id:"359", num:"359", title:"Suspension of the enforcement of the rights conferred by Part III during emergencies" },
    { id:"360", num:"360", title:"Provisions as to Financial Emergency" },
  ]},
  { partId:"part20", partName:"Part XX", partSubtitle:"Amendment of the Constitution", articles:[
    { id:"368", num:"368", title:"Power of Parliament to amend the Constitution and procedure therefor" },
  ]},
  { partId:"part21", partName:"Part XXI", partSubtitle:"Temporary, Transitional and Special Provisions", articles:[
    { id:"370",  num:"370",  title:"Temporary provisions with respect to the State of Jammu and Kashmir" },
    { id:"371",  num:"371",  title:"Special provision with respect to the States of Maharashtra and Gujarat" },
    { id:"371A", num:"371A", title:"Special provision with respect to the State of Nagaland" },
    { id:"371F", num:"371F", title:"Special provisions with respect to the State of Sikkim" },
    { id:"371J", num:"371J", title:"Special provisions with respect to the State of Karnataka" },
  ]},
  { partId:"part22", partName:"Part XXII", partSubtitle:"Short Title, Commencement, Authoritative Text in Hindi and Repeals", articles:[
    { id:"393", num:"393", title:"Short title" },
    { id:"394", num:"394", title:"Commencement" },
    { id:"395", num:"395", title:"Repeals" },
  ]},
];

// ══════════════════════════════════════════════════════════════════
// WELCOME SCREEN
// ══════════════════════════════════════════════════════════════════
function WelcomeScreen({ totalArticles }) {
  return (
    <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 40px", background:"linear-gradient(160deg,#F7F0E6 0%,#EDE0CC 60%,#E5D4B8 100%)", minHeight:"100vh", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B9944E'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3Ccircle cx='60' cy='0' r='2'/%3E%3Ccircle cx='0' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize:"60px 60px" }} />
      <div style={{ width:120, height:120, borderRadius:"50%", border:"3px solid rgba(185,148,78,0.35)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28, boxShadow:"0 0 40px rgba(185,148,78,0.15)" }}>
        <div style={{ fontSize:64, lineHeight:1 }}>⚖️</div>
      </div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,54px)", fontWeight:700, color:"#1C1008", textAlign:"center", lineHeight:1.15, marginBottom:10 }}>Constitution of India</h1>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,22px)", color:"#B9944E", fontWeight:600, marginBottom:20, letterSpacing:"1px", textTransform:"uppercase", textAlign:"center" }}>UPSC CSE Study Companion</p>
      <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#6B5A3E", textAlign:"center", maxWidth:560, lineHeight:1.8, marginBottom:44 }}>
        Every Article. Landmark Judgements. UPSC Prelims Practice. Completely free — no API costs, no limits.
      </p>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", marginBottom:48 }}>
        {[{ icon:"📜", label:"Articles", val:totalArticles+"+" }, { icon:"⚖️", label:"Landmark Cases", val:"500+" }, { icon:"📝", label:"UPSC Questions", val:"1000+" }, { icon:"🏛️", label:"Parts", val:"22" }].map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.72)", backdropFilter:"blur(12px)", borderRadius:14, padding:"18px 26px", textAlign:"center", border:"1px solid rgba(185,148,78,0.3)", boxShadow:"0 2px 16px rgba(185,148,78,0.12)" }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:"#E8860A", lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:13, color:"#8B7355", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"rgba(255,255,255,0.6)", borderRadius:12, padding:"14px 28px", border:"1px solid rgba(185,148,78,0.25)", fontSize:15, color:"#7A6548", fontStyle:"italic", display:"flex", alignItems:"center", gap:10 }}>
        <span>←</span><span>Select any Article from the sidebar to begin your study session</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ══════════════════════════════════════════════════════════════════
function LoadingView({ article }) {
  return (
    <div style={{ padding:"36px 40px", maxWidth:900 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32 }}>
        <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #E8860A", borderTopColor:"transparent", animation:"spin 0.8s linear infinite", flexShrink:0 }} />
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#1C1008" }}>Loading Article {article.num}</div>
          <div style={{ fontSize:14, color:"#9A835E", marginTop:3 }}>Fetching constitutional text, judgements & UPSC questions…</div>
        </div>
      </div>
      {[140,80,200,120,160,90,210,100].map((w,i) => (
        <div key={i} className="skeleton" style={{ height:i%3===0?20:14, width:`${w+(i*17%60)}px`, marginBottom:12, maxWidth:"100%" }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ARTICLE TAB
// ══════════════════════════════════════════════════════════════════
function ArticleTab({ content }) {
  if (!content) return null;
  return (
    <div className="fade-up" style={{ maxWidth:820, paddingBottom:48 }}>
      <div style={{ background:"rgba(255,255,255,0.75)", borderRadius:14, border:"1px solid rgba(185,148,78,0.25)", padding:"28px 32px", marginBottom:24, boxShadow:"0 2px 14px rgba(185,148,78,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <span style={{ fontSize:18 }}>📜</span>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:700, color:"#B9944E", letterSpacing:"1.5px", textTransform:"uppercase" }}>Constitutional Text</h3>
        </div>
        <p style={{ fontFamily:"'Crimson Pro',serif", fontSize:17, lineHeight:1.9, color:"#2C1F0A", whiteSpace:"pre-wrap" }}>{content.articleText}</p>
      </div>

      <div style={{ background:"linear-gradient(135deg,rgba(232,134,10,0.08) 0%,rgba(185,148,78,0.05) 100%)", border:"1px solid rgba(232,134,10,0.25)", borderRadius:12, padding:"22px 28px", marginBottom:24 }}>
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <span style={{ fontSize:18 }}>💡</span>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:700, color:"#B9944E", letterSpacing:"1.5px", textTransform:"uppercase" }}>Plain Language Summary</h3>
        </div>
        <p style={{ fontSize:17, lineHeight:1.8, color:"#3A2810" }}>{content.summary}</p>
      </div>

      {content.keyPoints?.length > 0 && (
        <div style={{ background:"rgba(255,255,255,0.65)", borderRadius:12, border:"1px solid rgba(185,148,78,0.2)", padding:"22px 28px", marginBottom:24 }}>
          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>🎯</span>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:700, color:"#B9944E", letterSpacing:"1.5px", textTransform:"uppercase" }}>Key Points for UPSC</h3>
          </div>
          <ul style={{ listStyle:"none" }}>
            {content.keyPoints.map((pt,i) => (
              <li key={i} style={{ display:"flex", gap:12, padding:"9px 0", borderBottom:i<content.keyPoints.length-1?"1px solid rgba(185,148,78,0.12)":"none" }}>
                <span style={{ width:22, height:22, borderRadius:"50%", background:"#E8860A", color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{i+1}</span>
                <span style={{ fontSize:16, lineHeight:1.65, color:"#2C1F0A" }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.amendments?.length > 0 && (
        <div style={{ background:"rgba(255,255,255,0.5)", borderRadius:12, border:"1px solid rgba(185,148,78,0.18)", padding:"18px 28px" }}>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <span style={{ fontSize:18 }}>📋</span>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:700, color:"#B9944E", letterSpacing:"1.5px", textTransform:"uppercase" }}>Amendment History</h3>
          </div>
          {content.amendments.map((am,i) => (
            <p key={i} style={{ fontSize:15, color:"#5A4A2A", lineHeight:1.7, marginBottom:i<content.amendments.length-1?8:0 }}>• {am}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// JUDGEMENTS TAB
// ══════════════════════════════════════════════════════════════════
function JudgementsTab({ judgements }) {
  if (!judgements?.length) return (
    <div className="fade-in" style={{ padding:"40px 0", textAlign:"center", color:"#9A835E" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>⚖️</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>No specific landmark judgements for this article.</p>
    </div>
  );
  return (
    <div className="fade-up" style={{ maxWidth:820, paddingBottom:48 }}>
      <div style={{ marginBottom:20, fontSize:14, color:"#9A835E" }}>{judgements.length} landmark {judgements.length===1?"judgement":"judgements"} found</div>
      {judgements.map((j,i) => (
        <div key={i} className="judgement-card" style={{ background:"rgba(255,255,255,0.72)", borderRadius:14, border:"1px solid rgba(185,148,78,0.2)", padding:"24px 28px", marginBottom:18, transition:"all 0.22s ease", boxShadow:"0 2px 10px rgba(185,148,78,0.06)" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12, flexWrap:"wrap" }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#1C1008", lineHeight:1.3, flex:1 }}>{j.caseName}</h3>
            <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
              <span style={{ background:"#1C1008", color:"#E8C97A", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{j.year}</span>
              <span style={{ background:"rgba(232,134,10,0.12)", color:"#C47A0A", fontSize:11, padding:"3px 10px", borderRadius:20, border:"1px solid rgba(232,134,10,0.3)" }}>{j.court}</span>
            </div>
          </div>
          {j.citation && <div style={{ display:"inline-block", fontSize:12, color:"#9A835E", background:"rgba(185,148,78,0.08)", padding:"2px 10px", borderRadius:6, marginBottom:14, fontFamily:"monospace" }}>{j.citation}</div>}
          <p style={{ fontSize:16, lineHeight:1.8, color:"#3A2810", marginBottom:14 }}>{j.significance}</p>
          <div style={{ background:"linear-gradient(135deg,rgba(28,16,8,0.05) 0%,rgba(185,148,78,0.05) 100%)", borderLeft:"3px solid #E8860A", borderRadius:"0 8px 8px 0", padding:"12px 16px" }}>
            <div style={{ fontSize:11, color:"#B9944E", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:5 }}>Key Holding</div>
            <p style={{ fontSize:15, color:"#2C1F0A", lineHeight:1.65, fontStyle:"italic" }}>"{j.keyHolding}"</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ TAB
// ══════════════════════════════════════════════════════════════════
function QuizTab({ questions, quizState, setQuizState }) {
  if (!questions?.length) return (
    <div className="fade-in" style={{ padding:"40px 0", textAlign:"center", color:"#9A835E" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>📝</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>No practice questions available for this article.</p>
    </div>
  );

  const LETTERS = ["a","b","c","d"];
  const q = questions[quizState.currentQ];
  const total = questions.length;

  const handleSelect = (letter) => {
    if (quizState.selectedAnswer !== null) return;
    const isCorrect = letter === q.correctAnswer?.toLowerCase();
    setQuizState(prev => ({ ...prev, selectedAnswer:letter, score:isCorrect?prev.score+1:prev.score }));
  };

  const handleNext = () => {
    if (quizState.currentQ+1 >= total) setQuizState(prev => ({ ...prev, completed:true }));
    else setQuizState(prev => ({ ...prev, currentQ:prev.currentQ+1, selectedAnswer:null }));
  };

  const reset = () => setQuizState({ currentQ:0, selectedAnswer:null, score:0, completed:false });

  if (quizState.completed) {
    const pct = Math.round((quizState.score/total)*100);
    const gc = pct>=80?"#1B8A3E":pct>=60?"#E8860A":"#C0392B";
    return (
      <div className="fade-up" style={{ maxWidth:600, paddingBottom:48 }}>
        <div style={{ background:"rgba(255,255,255,0.8)", borderRadius:20, border:"1px solid rgba(185,148,78,0.25)", padding:"44px 40px", textAlign:"center" }}>
          <div style={{ fontSize:64, marginBottom:20 }}>{pct>=80?"🏆":pct>=60?"📖":"💪"}</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:700, color:"#1C1008", marginBottom:10 }}>Quiz Complete</h2>
          <p style={{ fontSize:18, color:gc, fontWeight:700, marginBottom:24 }}>{pct>=80?"Excellent!":pct>=60?"Good":"Keep Practicing"}</p>
          <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:30 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:700, color:gc }}>{quizState.score}/{total}</div>
              <div style={{ fontSize:13, color:"#9A835E", marginTop:4 }}>Score</div>
            </div>
            <div style={{ width:1, background:"rgba(185,148,78,0.2)" }} />
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:700, color:gc }}>{pct}%</div>
              <div style={{ fontSize:13, color:"#9A835E", marginTop:4 }}>Accuracy</div>
            </div>
          </div>
          <button onClick={reset} style={{ background:"#1C1008", color:"#E8C97A", border:"none", borderRadius:10, padding:"13px 36px", fontSize:16, fontFamily:"'Crimson Pro',serif", fontWeight:600, cursor:"pointer" }}>Retry Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ maxWidth:720, paddingBottom:48 }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13, color:"#9A835E" }}>
          <span>Question {quizState.currentQ+1} of {total}</span>
          <span>Score: {quizState.score}/{quizState.currentQ+(quizState.selectedAnswer!==null?1:0)}</span>
        </div>
        <div style={{ height:4, background:"rgba(185,148,78,0.2)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#E8860A,#C9A84C)", borderRadius:4, width:`${(quizState.currentQ/total)*100}%`, transition:"width 0.4s ease" }} />
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,0.78)", borderRadius:16, border:"1px solid rgba(185,148,78,0.22)", padding:"28px 32px", marginBottom:16 }}>
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
          <span style={{ background:"#1C1008", color:"#E8C97A", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"1px" }}>PRELIMS STYLE</span>
          {q.yearAsked && <span style={{ background:"rgba(232,134,10,0.1)", color:"#C47A0A", fontSize:11, padding:"3px 10px", borderRadius:20, border:"1px solid rgba(232,134,10,0.25)" }}>UPSC {q.yearAsked}</span>}
        </div>
        <p style={{ fontFamily:"'Crimson Pro',serif", fontSize:18, lineHeight:1.75, color:"#1C1008", fontWeight:500 }}>{q.question}</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {q.options?.map((opt,i) => {
          const letter = LETTERS[i];
          const isSel = quizState.selectedAnswer === letter;
          const isCorr = letter === q.correctAnswer?.toLowerCase();
          const answered = quizState.selectedAnswer !== null;
          let bg="rgba(255,255,255,0.65)", bdr="rgba(185,148,78,0.22)", tc="#2C1F0A", lbg="#E5D9C8", lc="#5A4A2A";
          if (answered) {
            if (isCorr) { bg="rgba(27,138,62,0.08)"; bdr="rgba(27,138,62,0.45)"; tc="#155A2C"; lbg="#1B8A3E"; lc="white"; }
            else if (isSel) { bg="rgba(192,57,43,0.07)"; bdr="rgba(192,57,43,0.4)"; tc="#8B1F13"; lbg="#C0392B"; lc="white"; }
            else { bg="rgba(255,255,255,0.35)"; tc="#9A835E"; }
          }
          return (
            <button key={letter} className="ans-btn" disabled={answered} onClick={() => handleSelect(letter)} style={{ width:"100%", display:"flex", gap:14, alignItems:"flex-start", padding:"14px 18px", background:bg, border:`1.5px solid ${bdr}`, borderRadius:12, cursor:answered?"default":"pointer", textAlign:"left" }}>
              <span style={{ width:28, height:28, borderRadius:8, background:lbg, color:lc, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Cormorant Garamond',serif" }}>{letter.toUpperCase()}</span>
              <span style={{ fontSize:16, lineHeight:1.6, color:tc, fontFamily:"'Crimson Pro',serif" }}>{opt}</span>
              {answered && isCorr && <span style={{ marginLeft:"auto", flexShrink:0, fontSize:18 }}>✓</span>}
              {answered && isSel && !isCorr && <span style={{ marginLeft:"auto", flexShrink:0, fontSize:18 }}>✗</span>}
            </button>
          );
        })}
      </div>

      {quizState.selectedAnswer !== null && (
        <div className="slide-in" style={{ background:"rgba(255,255,255,0.75)", borderRadius:12, border:"1px solid rgba(185,148,78,0.2)", padding:"20px 24px", marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#B9944E", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>💬 Explanation</div>
          <p style={{ fontSize:16, lineHeight:1.8, color:"#2C1F0A" }}>{q.explanation}</p>
        </div>
      )}

      {quizState.selectedAnswer !== null && (
        <button onClick={handleNext} style={{ background:"linear-gradient(135deg,#1C1008,#2C1F0A)", color:"#E8C97A", border:"none", borderRadius:11, padding:"13px 32px", fontSize:16, cursor:"pointer", fontFamily:"'Crimson Pro',serif", fontWeight:600 }}>
          {quizState.currentQ+1 >= total ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════
function Sidebar({ filteredParts, expandedParts, togglePart, searchQuery, setSearchQuery, selectedArticle, onSelect }) {
  return (
    <aside className="sidebar" style={{ width:290, minWidth:290, background:"#140E06", display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", borderRight:"1px solid rgba(185,148,78,0.2)", boxShadow:"4px 0 24px rgba(0,0,0,0.35)" }}>
      <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(185,148,78,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#E8860A,#C9A84C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>⚖️</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:"#E8C97A", letterSpacing:"0.5px" }}>Samvidhan</div>
            <div style={{ fontSize:10, color:"rgba(232,201,122,0.45)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Constitution Explorer</div>
          </div>
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#C9A84C", fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input type="text" placeholder="Search articles…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(185,148,78,0.25)", borderRadius:9, padding:"9px 12px 9px 34px", color:"#EDE0CC", fontSize:14, fontFamily:"'Crimson Pro',serif", outline:"none" }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#9A835E", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
        {filteredParts.length === 0 && <div style={{ padding:"24px 20px", textAlign:"center", color:"rgba(185,148,78,0.5)", fontSize:14 }}>No articles found</div>}
        {filteredParts.map(part => {
          const isOpen = !!expandedParts[part.partId];
          return (
            <div key={part.partId}>
              <button className="part-header" onClick={() => togglePart(part.partId)} style={{ width:"100%", padding:"9px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ flex:1, minWidth:0, marginRight:8 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:700, color:"#C9A84C", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{part.partName}</div>
                  {part.partSubtitle && <div style={{ fontSize:11, color:"rgba(185,148,78,0.5)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{part.partSubtitle}</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                  <span style={{ background:"rgba(185,148,78,0.15)", color:"#C9A84C", fontSize:10, padding:"1px 6px", borderRadius:10, fontFamily:"monospace" }}>{part.articles.length}</span>
                  <span style={{ color:"#9A835E", fontSize:10, transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.2s ease", display:"block" }}>▶</span>
                </div>
              </button>
              {isOpen && part.articles.map(art => {
                const active = selectedArticle?.id === art.id;
                return (
                  <button key={art.id} className="art-item" onClick={() => onSelect(art, part)} style={{ width:"100%", padding:"7px 18px 7px 26px", display:"flex", alignItems:"flex-start", gap:10, background:active?"rgba(232,134,10,0.14)":"none", border:"none", borderLeft:active?"3px solid #E8860A":"3px solid transparent", cursor:"pointer", textAlign:"left" }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, color:active?"#E8860A":"rgba(185,148,78,0.4)", minWidth:28, paddingTop:2, flexShrink:0 }}>{art.num==="—"?"Pre":art.num}</span>
                    <span style={{ fontSize:13, lineHeight:1.45, fontFamily:"'Crimson Pro',serif", color:active?"#F5E6CC":"rgba(237,224,204,0.6)" }}>{art.title}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={{ padding:"10px 20px", borderTop:"1px solid rgba(185,148,78,0.12)", fontSize:11, color:"rgba(185,148,78,0.3)", textAlign:"center", letterSpacing:"0.5px" }}>
        Free Forever • UPSC CSE Prep
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════
// PAGE — reads pre-generated JSON, zero runtime API cost
// ══════════════════════════════════════════════════════════════════
export default function Home({ articleIndex }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedPart, setSelectedPart]       = useState(null);
  const [content, setContent]                 = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [activeTab, setActiveTab]             = useState("article");
  const [searchQuery, setSearchQuery]         = useState("");
  const [expandedParts, setExpandedParts]     = useState({ preamble:true });
  const [quizState, setQuizState]             = useState({ currentQ:0, selectedAnswer:null, score:0, completed:false });

  const handleSelect = useCallback(async (art, part) => {
    setSelectedArticle(art);
    setSelectedPart(part);
    setContent(null);
    setLoading(true);
    setActiveTab("article");
    setQuizState({ currentQ:0, selectedAnswer:null, score:0, completed:false });

    // Fetch from static JSON file — no API call, instant, free
    try {
      const res = await fetch(`/data/${art.id}.json`);
      if (!res.ok) throw new Error("Content not yet generated. Run: npm run generate");
      const data = await res.json();
      setContent(data);
    } catch (e) {
      setContent({ _error: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePart = id => setExpandedParts(p => ({ ...p, [id]:!p[id] }));

  const filteredParts = CONSTITUTION_DATA.map(part => ({
    ...part,
    articles: part.articles.filter(a =>
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.num.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(p => p.articles.length > 0);

  const totalArticles = CONSTITUTION_DATA.reduce((acc,p) => acc + p.articles.length, 0);

  const TABS = [
    { id:"article",    label:"📜 Article",    count:null },
    { id:"judgements", label:"⚖️ Judgements", count:content?.judgements?.length },
    { id:"quiz",       label:"📝 UPSC Quiz",  count:content?.upscQuestions?.length },
  ];

  return (
    <>
      <Head><title>Samvidhan — Constitution of India UPSC Study App</title></Head>
      <div style={{ display:"flex", height:"100vh", fontFamily:"'Crimson Pro',serif", background:"#F7F0E6" }}>
        <Sidebar
          filteredParts={filteredParts}
          expandedParts={expandedParts}
          togglePart={togglePart}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArticle={selectedArticle}
          onSelect={handleSelect}
        />

        <main style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          {!selectedArticle ? (
            <WelcomeScreen totalArticles={totalArticles} />
          ) : (
            <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
              {/* Sticky header */}
              <div className="article-header" style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(185,148,78,0.2)", padding:"20px 40px 0", position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 16px rgba(185,148,78,0.08)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                  <div style={{ background:"#1C1008", color:"#E8C97A", borderRadius:10, padding:"6px 14px", fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, lineHeight:1.2, flexShrink:0 }}>
                    {selectedArticle.num==="—"?"Pre.":` Art. ${selectedArticle.num}`}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(18px,3vw,26px)", fontWeight:700, color:"#1C1008", lineHeight:1.25 }}>{selectedArticle.title}</h1>
                    {selectedPart && <div style={{ marginTop:5, fontSize:13, color:"#B9944E" }}>{selectedPart.partName}{selectedPart.partSubtitle?` — ${selectedPart.partSubtitle}`:""}</div>}
                  </div>
                  {/* Generated badge */}
                  <div style={{ background:"rgba(27,138,62,0.1)", border:"1px solid rgba(27,138,62,0.3)", borderRadius:20, padding:"4px 12px", fontSize:11, color:"#1B6A3A", display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#1B8A3E", display:"inline-block" }} />
                    Free to use
                  </div>
                </div>
                <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(185,148,78,0.15)" }}>
                  {TABS.map(tab => {
                    const active = activeTab === tab.id;
                    return (
                      <button key={tab.id} className="tab-btn" onClick={() => !loading && setActiveTab(tab.id)} style={{ padding:"11px 22px", background:"none", border:"none", borderBottom:active?"2.5px solid #E8860A":"2.5px solid transparent", color:active?"#E8860A":"#9A835E", fontSize:15, fontFamily:"'Crimson Pro',serif", fontWeight:active?600:400, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1, display:"flex", alignItems:"center", gap:6, transition:"color 0.15s", whiteSpace:"nowrap" }}>
                        {tab.label}
                        {tab.count!=null && <span style={{ background:active?"rgba(232,134,10,0.15)":"rgba(185,148,78,0.12)", color:active?"#E8860A":"#9A835E", fontSize:11, padding:"1px 7px", borderRadius:10, fontFamily:"monospace" }}>{tab.count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="main-content" style={{ flex:1, padding:"32px 40px", overflowY:"auto" }}>
                {loading && <LoadingView article={selectedArticle} />}

                {!loading && content?._error && (
                  <div style={{ background:"rgba(192,57,43,0.07)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:12, padding:"24px 28px", maxWidth:620 }}>
                    <div style={{ fontSize:24, marginBottom:12 }}>⚠️</div>
                    <div style={{ fontWeight:700, color:"#8B1F13", fontSize:17, marginBottom:8 }}>Content Not Yet Generated</div>
                    <p style={{ fontSize:15, color:"#7A4A3A", lineHeight:1.7, marginBottom:16 }}>{content._error}</p>
                    <div style={{ background:"rgba(255,255,255,0.6)", borderRadius:8, padding:"14px 18px", fontFamily:"monospace", fontSize:14, color:"#3A2810", border:"1px solid rgba(185,148,78,0.2)" }}>
                      npm run generate
                    </div>
                  </div>
                )}

                {!loading && content && !content._error && (
                  <>
                    {activeTab==="article"    && <ArticleTab content={content} />}
                    {activeTab==="judgements" && <JudgementsTab judgements={content.judgements} />}
                    {activeTab==="quiz"       && <QuizTab questions={content.upscQuestions} quizState={quizState} setQuizState={setQuizState} />}
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ── getStaticProps: tells Next.js how many files are generated ──
export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), "public", "data");
  let articleIndex = [];
  if (fs.existsSync(dataDir)) {
    articleIndex = fs.readdirSync(dataDir)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json",""));
  }
  return { props: { articleIndex } };
}
