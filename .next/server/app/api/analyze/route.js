(()=>{var e={};e.id=786,e.ids=[786],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},9021:e=>{"use strict";e.exports=require("fs")},1630:e=>{"use strict";e.exports=require("http")},5591:e=>{"use strict";e.exports=require("https")},3873:e=>{"use strict";e.exports=require("path")},1997:e=>{"use strict";e.exports=require("punycode")},7910:e=>{"use strict";e.exports=require("stream")},9551:e=>{"use strict";e.exports=require("url")},8354:e=>{"use strict";e.exports=require("util")},3566:e=>{"use strict";e.exports=require("worker_threads")},4075:e=>{"use strict";e.exports=require("zlib")},3024:e=>{"use strict";e.exports=require("node:fs")},7075:e=>{"use strict";e.exports=require("node:stream")},7830:e=>{"use strict";e.exports=require("node:stream/web")},5770:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>g,routeModule:()=>l,serverHooks:()=>x,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var s={};t.r(s),t.d(s,{POST:()=>c});var i=t(2706),o=t(8203),a=t(5994),n=t(7590),u=t(9187);let p=new n.Ay({apiKey:process.env.OPENAI_API_KEY});async function c(e){try{let{resumeContent:r,jobDescription:t}=await e.json();if(!r||!t)return u.NextResponse.json({error:"Resume content and job description are required"},{status:400});let s=`You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter. 
        Your task is to analyze a candidate's resume against a specific job description.
        
        Provide a detailed analysis in raw JSON format (no markdown, no code blocks) with the following structure:
        {
          "score": number (0-100),
          "matchAnalysis": "A brief overall summary of the match",
          "missingKeywords": ["keyword1", "keyword2", ...],
          "criticalFixes": ["fix1", "fix2", ...],
          "optimizationSuggestions": ["suggestion1", "suggestion2", ...],
          "highlightedSkills": ["skill1", "skill2", ...] 
        }
        
        Guidelines:
        - Be objective and critical.
        - Focus on keywords, formatting potential issues, and experience alignment.
        - High scores (85+) should only be given to near-perfect matches.
        - Critical fixes should address missing requirements or poor phrasing.`,i=`
        RESUME CONTENT:
        ${JSON.stringify(r)}

        JOB DESCRIPTION:
        ${t}
        `,o=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:s},{role:"user",content:i}],response_format:{type:"json_object"},temperature:.5})).choices[0].message.content;return u.NextResponse.json(JSON.parse(o||"{}"))}catch(e){return console.error("ATS Analysis Error:",e),u.NextResponse.json({error:e.message||"Failed to analyze resume"},{status:500})}}let l=new i.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"C:\\Users\\hp\\OneDrive - PKM EDUCATIONAL TRUST\\Documents\\Resume_Builder\\src\\app\\api\\analyze\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:x}=l;function g(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},6487:()=>{},8335:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[638,452,590],()=>t(5770));module.exports=s})();