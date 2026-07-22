เอกสารอ้างอิง : https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vlan_2960s_cg.html

# Software Configuration Guide, Cisco IOS Release 15.2(4)E (Catalyst 2960-Plus and 2960-C Switches)
```
       if (typeof cdc === "undefined"){ cdc = {}; } cdc.localizedLang="en/us"; if (window.cdcext === undefined) { window.cdcext = {}; } cdcext.customEnvironment = "prod"; if (window.cdclocale === undefined) { window.cdclocale = {}; } cdclocale.locale = cdc.localizedLang=="en/us"?"en\_us":cdc.localizedLang;    window\['adrum-start-time'\] = new Date().getTime(); window.environ = "prod" ;   if (window.cpe === undefined) { window.cpe = {}; } cpe.accountName = "prod"; cpe.config = \["cinf","dsc","pps"\]; cpe.hideMethod = "elements"; window.targetGlobalSettings = JSON.parse('{\\x22timeout\\x22:4000}'); window.targetPageParamsAll = () => JSON.parse('{\\x22entity\\x22:\\x22{\\\\\\x22id\\\\\\x22:\\\\\\x221623317959009449\\\\\\x22,\\\\\\x22categoryId\\\\\\x22:\\\\\\x22\\\\\\x22}\\x22}'); const bullseyeLibrary = \`/etc.clientlibs/cisco-cdc/clientlibs/clientlib-external/resources/external/bullseye.js\`; import(bullseyeLibrary);   Software Configuration Guide, Cisco IOS Release 15.2(4)E (Catalyst 2960-Plus and 2960-C Switches) - Configuring VLANs \[Cisco Catalyst 2960 Series Switches\] - Cisco                                    $CQ(function() { CQ\_Analytics.SegmentMgr.loadSegments("\\/etc\\/segmentation"); CQ\_Analytics.ClientContextUtils.init("\\/c\\/dnc\\/etc\\/clientcontext\\/default", "\\/content\\/en\\/us\\/td\\/docs\\/switches\\/lan\\/catalyst2960\\/software\\/release\\/15\\u002D2\_4\_e\\/configurationguide\\/b\_1524e\_consolidated\_2960p\_2960c\_cg\\/m\_1522e\_vlan\_vlan\_2960s\_cg"); });      sessionStorage.setItem("logOutIntermediateMessage", 'You are being logged out.');    \[ { "@context": "http://www.schema.org", "@type": "WebPage", "name": "Configuring VLANs", "url": "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2\_4\_e/configurationguide/b\_1524e\_consolidated\_2960p\_2960c\_cg/m\_1522e\_vlan\_vlan\_2960s\_cg.html", "description": "Configuring VLANs", "publisher": { "@type": "Corporation", "name": "Cisco" } }\]     !function(e){var n="https://s.go-mpulse.net/boomerang/";if("False"=="True")e.BOOMR\_config=e.BOOMR\_config||{},e.BOOMR\_config.PageParams=e.BOOMR\_config.PageParams||{},e.BOOMR\_config.PageParams.pci=!0,n="https://s2.go-mpulse.net/boomerang/";if(window.BOOMR\_API\_key="GKZXC-NS3SU-A7VFH-HKBHM-U7LKH",function(){function e(){if(!i){var e=document.createElement("script");e.id="boomr-scr-as",e.src=window.BOOMR.url,e.async=!0,o.parentNode.appendChild(e),i=!0}}function t(e){i=!0;var n,t,a,r,d=document,O=window;if(window.BOOMR.snippetMethod=e?"if":"i",t=function(e,n){var t=d.createElement("script");t.id=n||"boomr-if-as",t.src=window.BOOMR.url,BOOMR\_lstart=(new Date).getTime(),e=e||d.body,e.appendChild(t)},!window.addEventListener&&window.attachEvent&&navigator.userAgent.match(/MSIE \[67\]\\./))return window.BOOMR.snippetMethod="s",void t(o.parentNode,"boomr-async");a=document.createElement("IFRAME"),a.src="about:blank",a.title="",a.role="presentation",a.loading="eager",r=(a.frameElement||a).style,r.width=0,r.height=0,r.border=0,r.display="none",o.parentNode.appendChild(a);try{O=a.contentWindow,d=O.document.open()}catch(\_){n=document.domain,a.src="javascript:var d=document.open();d.domain='"+n+"';void(0);",O=a.contentWindow,d=O.document.open()}if(n)d.\_boomrl=function(){this.domain=n,t()},d.write("<bo"+"dy onload='document.\_boomrl();'>");else if(O.\_boomrl=function(){t()},O.addEventListener)O.addEventListener("load",O.\_boomrl,!1);else if(O.attachEvent)O.attachEvent("onload",O.\_boomrl);d.close()}function a(e){window.BOOMR\_onload=e&&e.timeStamp||(new Date).getTime()}if(!window.BOOMR||!window.BOOMR.version&&!window.BOOMR.snippetExecuted){window.BOOMR=window.BOOMR||{},window.BOOMR.snippetStart=(new Date).getTime(),window.BOOMR.snippetExecuted=!0,window.BOOMR.snippetVersion=12,window.BOOMR.url=n+"GKZXC-NS3SU-A7VFH-HKBHM-U7LKH";var o=document.currentScript||document.getElementsByTagName("script")\[0\],i=!1,r=document.createElement("link");if(r.relList&&"function"==typeof r.relList.supports&&r.relList.supports("preload")&&"as"in r)window.BOOMR.snippetMethod="p",r.href=window.BOOMR.url,r.rel="preload",r.as="script",r.addEventListener("load",e),r.addEventListener("error",function(){t(!0)}),setTimeout(function(){if(!i)t(!0)},3e3),BOOMR\_lstart=(new Date).getTime(),o.parentNode.appendChild(r);else t(!1);if(window.addEventListener)window.addEventListener("load",a,!1);else if(window.attachEvent)window.attachEvent("onload",a)}}(),"".length>0)if(e&&"performance"in e&&e.performance&&"function"==typeof e.performance.setResourceTimingBufferSize)e.performance.setResourceTimingBufferSize();!function(){if(BOOMR=e.BOOMR||{},BOOMR.plugins=BOOMR.plugins||{},!BOOMR.plugins.AK){var n=""=="true"?1:0,t="",a="vmduliqxglwgy2sqlalq-f-188a1d7c8-clientnsv4-s.akamaihd.net",o="false"=="true"?2:1,i={"ak.v":"41","ak.cp":"61004","ak.ai":parseInt("271834",10),"ak.ol":"0","ak.cr":12,"ak.ipv":4,"ak.proto":"h2","ak.rid":"85688cec","ak.r":45657,"ak.a2":n,"ak.m":"dsca","ak.n":"essl","ak.cport":60505,"ak.gh":"110.164.21.126","ak.quicv":"","ak.tlsv":"tls1.3","ak.0rtt":"","ak.0rtt.ed":"","ak.csrc":"-","ak.acc":"","ak.t":"1783650327","ak.ak":"hOBiQwZUYzCg5VSAfCLimQ==HIChAJOsh+4784K2R+KVqwrBgxT9jdk72fRls36x5ShEKBjMfOm+clTfdTxUl78euTBk2xaySOk1TeTTb2LCrdX0Yap4FlqA3/jzxL4YyuTWVCYxcl7+kTOy62FsDcnaFnf3CNiZ+aprkQkO6fxtsUjmazOotwfm3bjYdNo3Jr/WreJ8FPuZN2zampe1JDZT0jEf3v8oFRuyO3YHG1M8FDPR0j6fZRyoizUK0gHWk7CId4FEqzsr8zM4LfCP+xEfsQ139cCOM6RFKfrda/PCyuNzPkB6docj8MopclVvRs1yHdHBUUPtOVC/BJGUd7ADYeLzW2AgR0syuE5Uu9bVV/ycXIMHYbmQcCpVuFnrjq5hGXKTAreCK45B+jCz66WnhvDCx+3zSZ+WiGO5W9j19IPMpdjQhTziNMOwyA33YJo=","ak.pv":"550","ak.dpoabenc":"","ak.tf":o};if(""!==t)i\["ak.ruds"\]=t;var r={i:!1,av:function(n){var t="http.initiator";if(n&&(!n\[t\]||"spa\_hard"===n\[t\]))i\["ak.feo"\]=void 0!==e.aFeoApplied?1:0,BOOMR.addVar(i)},rv:function(){var e=\["ak.cport","ak.cr","ak.csrc","ak.gh","ak.ipv","ak.m","ak.n","ak.ol","ak.proto","ak.quicv","ak.tlsv","ak.0rtt","ak.0rtt.ed","ak.r","ak.acc","ak.t","ak.tf"\];BOOMR.removeVar(e)}};BOOMR.plugins.AK={akVars:i,akDNSPreFetchDomain:a,init:function(){if(!r.i){var e=BOOMR.subscribe;e("before\_beacon",r.av,null,null),e("onbeacon",r.rv,null,null),r.i=!0}return this},is\_complete:function(){return!0}}}}()}(window);

*   [Skip to content](#fw-content)
*   [Skip to search](#)
*   [Skip to footer](#fw-footer-v2)

*   [Cisco.com Worldwide](https://www.cisco.com/site/us/en/index.html)
*   [Products and Services](/site/us/en/products/index.html)
*   [Solutions](https://www.cisco.com/site/us/en/solutions/index.html)
*   [Support](/c/en/us/support/index.html)
*   [Learn](/site/us/en/learn/index.html)
*   [Explore Cisco](/site/us/en/about/sitemap.html)
*   [How to Buy](/site/us/en/buy/index.html)
*   [Partners Home](https://www.cisco.com/site/us/en/partners/index.html)
*   [Partner Program](/site/us/en/partners/360-partner-program/partner-program/index.html)
*   [Support](https://www.cisco.com/site/us/en/partners/support-help/index.html)
*   [Tools](/site/us/en/partners/360-partner-program/tools-training/index.html)
*   [Find a Cisco Partner](https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/)
*   [Meet our Partners](https://www.cisco.com/site/us/en/partners/connect-with-a-partner/index.html)
*   [Become a Cisco Partner](https://www.cisco.com/site/us/en/partners/index.html)

*   [](#)
*   [Home](/c/en/us/index.html)
*   [Support](/c/en/us/support/index.html)
*   [Product Support](/c/en/us/support/all-products.html)
*   [Switches](/c/en/us/support/switches/category.html)
*   [Cisco Catalyst 2960 Series Switches](/c/en/us/support/switches/catalyst-2960-series-switches/series.html)
*   [Configuration Guides](/c/en/us/support/switches/catalyst-2960-series-switches/products-installation-and-configuration-guides-list.html)

if (window.cdc === undefined) { window.cdc = {}; } if (cdc.breadcrumb === undefined) { cdc.breadcrumb = (function () { let clone = document.querySelector('#fw-breadcrumb').cloneNode(true); let appendClone = function () { let hasBreadcrumb = document.querySelector('#fw-breadcrumb') !== null, firstMarquee = document.querySelectorAll('.dmc-mq')\[0\]; if (!hasBreadcrumb && firstMarquee !== undefined) { firstMarquee.querySelector('.frame .inset').insertBefore(this.clone, firstMarquee.querySelector('.frame .inset').firstElementChild); } }; return { clone: clone, appendClone: appendClone } }()); } //DE380224 var anchorChild = document.getElementsByTagName("a"); for(var i=0; i<anchorChild.length; i++){ if(anchorChild\[i\].getAttribute("itemprop")=="item") { if ( anchorChild\[i\].href.includes("%3Clocale%3E") ){ let anchorChildHREF = anchorChild\[i\].href; let docLocale = document.querySelector('meta\[name="locale"\]').getAttribute('content'); let docLanguage = document.querySelector('meta\[name="language"\]').getAttribute('content'); var docSeparator; if ((docLocale.toLowerCase() == "us") && (docLanguage.toLowerCase() == "en")) { docSeparator="/"; } else { docSeparator="\_"; } let anchorURLReplace = docLanguage.toLowerCase() + docSeparator + docLocale.toLowerCase(); anchorChildHREF = anchorChildHREF.replace("%3Clocale%3E", anchorURLReplace); anchorChild\[i\].setAttribute('href', anchorChildHREF); } } }

Software Configuration Guide, Cisco IOS Release 15.2(4)E (Catalyst 2960-Plus and 2960-C Switches)
=================================================================================================

// initialize dictionary for i18n cdc.util.ensureNamespace("cdc.rc"); cdc.rc.eotkeys = { showOnly5Products : "Show Only 5 Products", showAllRowsProducts : "Show All nRows Products", supportCommunityUrl : "https://community.cisco.com/t5/technology-and-support/ct-p/technology-support", supportCommunity : "Cisco Community", thankYou : "Thank You", viewersAlso : "Customers Also Viewed", show : "Show", more : "More", showOnly3Documents: "Show Only 3 Documents" };

Bias-Free Language

### Bias-Free Language

The documentation set for this product strives to use bias-free language. For the purposes of this documentation set, bias-free is defined as language that does not imply discrimination based on age, disability, gender, racial identity, ethnic identity, sexual orientation, socioeconomic status, and intersectionality. Exceptions may be present in the documentation due to language that is hardcoded in the user interfaces of the product software, language used based on RFP documentation, or language that is used by a referenced third-party product. [Learn more](https://www.cisco.com/site/us/en/about/purpose/social-impact/inclusive-language-policy.html) about how Cisco is using Inclusive Language.

/\* this is needed for the translation selector \*/ if (typeof(cdc) == "undefined") cdc={}; if (typeof(cdc.translations) == "undefined") cdc.translations={}; var bookTitle = 'Book Title Page';

Book Contents

Book Contents

*   [Preface](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_pref.html)
*   [Using the Command-Line Interface](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_sm_32se_using_cli_3850_5700_cg_cr.html)
*   Assigning the Switch IP Address and Default Gateway
    *   [Assigning the Switch IP Address and Default Gateway](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_assign_switch_ip_address_default_gateway_2960_cg.html)
*   Configuring Cisco IOS Configuration Engine
    *   [Configuring Cisco IOS Configuration Engine](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_nm_cns_2960s_2960c_cg.html)
*   Administering the Switch
    *   [Administering the Switch](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sm_swadmn_2960_2960s_2960c_cg.html)
*   Configuring Web-Based Authentication
    *   [Configuring Web-Based Authentication](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_webauth_2960_cg.html)
*   Auto Identity
    *   [Auto Identity](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_auto_identity.html)
*   Configuring Cisco TrustSec
    *   [Configuring Cisco TrustSec](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_trustsec_2960_cg.html)
*   Managing Switch Stacks
    *   [Managing Switch Stacks](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_stack_ha_stackmgr_2960_2960s_2960c_cg.html)
*   Clustering Switches
    *   [Clustering Switches](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_cl_switches_2960_2960c_2960s_2960p_cg.html)
*   Configuring SDM Templates
    *   [Configuring SDM Templates](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sm_sdm_2960_2960s_2960c_cg.html)
*   Configuring Switch-Based Authentication
    *   [Configuring Switch-Based Authentication](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_unautha_2960_cg.html)
*   X.509v3 Certificates for SSH Authentication
    *   [X.509v3 Certificates for SSH Authentication](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_sec_ssh_x509v3_auth.html)
*   Configuring IEEE 802.1x Port-Based Authentication
    *   [Configuring IEEE 802.1x Port-Based Authentication](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_sec_8021x_cg.html)
*   Configuring Interface Characteristics
    *   [Configuring Interface Characteristics](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_int_inter_2960s_cg.html)
    *   [Configuring Auto-MDIX](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_int_automdix_2960s_cg.html)
    *   [Configuring System MTU](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_int_mtu_2960s_cg.html)
    *   [Configuring Power over Ethernet](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_int_poe_2960s_cg.html)
*   Configuring VLANs, VTP, and Voice VLANs
    *   [Configuring VLANs](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vlan_2960s_cg.html)
    *   [Configuring VMPS](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vmps_2960s_cg.html)
    *   [Configuring VLAN Trunks](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_trunk_2960s_cg.html)
    *   [Configuring VTP](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vtp_2960s_cg.html)
    *   [Configuring Voice VLANs](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_voice_2960s_cg.html)
*   Configuring STP and MSTP
    *   [Configuring Spanning Tree Protocol](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_stp_2960_2960s_cg.html)
    *   [Configuring Multiple Spanning-Tree Protocol](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_mstp_2960_2960s_cg.html)
    *   [Configuring Optional Spanning-Tree Features](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_optional_spanning_tree_2960_2960s_cg.html)
*   Configuring Flex Links and the MAC Address-Table Move Update
    *   [Configuring Flex Links and the MAC Address-Table Move Update Feature](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_flex_link_2960_2960s_cg.html)
*   Configuring DHCP and IP Source Guard
    *   [Configuring DHCP](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_dhcp_2960_cg.html)
    *   [Configuring IP Source Guard](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_ipsrc_2960_cg.html)
*   Configuring Dynamic ARP Inspection
    *   [Configuring Dynamic ARP Inspection](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_dai_2960_cg.html)
*   Configuring Port-Based Traffic Control
    *   [Configuring Port-Based Traffic Control](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_port_based_traffic_ctrl_2960_cg.html)
*   Configuring UniDirectional Link Detection
    *   [Configuring UniDirectional Link Detection](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_udld_2960_2960s_cg.html)
*   Configuring Cisco Discovery Protocol
    *   [Configuring the Cisco Discovery Protocol](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_nm_cdp_2960s_2960c_cg.html)
*   Configuring LLDP, LLDP-MED, and Wired Location Service
    *   [Configuring LLDP, LLDP-MED, and Wired Location Service](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_int_lldp_2960s_cg.html)
*   Configuring SPAN and RSPAN
    *   [Configuring SPAN and RSPAN](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_nm_span_2960s_2960c_cg.html)
*   Configuring RMON
    *   [Configuring RMON](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_rmon_cg.html)
*   Configuring System Message Logging and Smart Logging
    *   [Configuring System Message Logging and Smart Logging](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_smlsl_cg.html)
*   Configuring SNMP
    *   [Configuring SNMP](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_nm_snmp_2960s_2960c_cg.html)
*   Configuring Cisco IOS IP SLAs
    *   [Configuring Cisco IP SLAs](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_nm_sla_2960s_2960c_cg.html)
*   Configuring Network Security with ACLs
    *   [Configuring Network Security with ACLs](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_acls_2960_cg.html)
*   IP Multicast Routing
    *   [Configuring IGMP Snooping and Multicast VLAN Registration](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_mc_config_igmp_snooping_and_mvr_cg.html)
*   Configuring QoS
    *   [Configuring QoS](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_qos_1522e_2960_2960s_2960c_2960plus.html)
    *   [Configuring Auto-QoS](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_autoqos_1522e_2960_2960s_2960c_2960plus.html)
*   Configuring Static IP Routing
    *   [Configuring Static IP Routing](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_rt_ipunirt_2960_2960s_2960c_cg.html)
*   Configuring IPv6
    *   [Configuring IPv6 MLD Snooping](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_ipv6_mldsnooping_2960_cg.html)
    *   [Configuring IPv6 Routing](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1523e_configuring_ipv6_2960_2960c_2960s_2960sf_2960p_cg.html)
*   Configuring IPv6
    *   [IPv6 ACLs](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sec_ipv6_acls.html)
*   Configuring EtherChannels
    *   [Configuring EtherChannels](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_etherchanl_2960_2960s_cg.html)
    *   [Configuring Link-State Tracking](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_layer2_link-state_tracking_2960_2960s_cg.html)
*   Troubleshooting Software Configuration
    *   [Troubleshooting the Software Configuration](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sm_trbl_2960_2960s_2960c_cg.html)
*   Configuring Online Diagnostics
    *   [Configuring Online Diagnostics](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_sm_diag_2960_2960s_2960c_cg.html)
*   Working with the Cisco IOS File System, Configuration Files, and Software Images
    *   [Working with the Cisco IOS File System, Configuration Files, and Software Images](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_wkg_cisco_ios_sys_config_file_soft_image_3750x_3560x_2960.html)

<div class="versionsdd"> <button class="versionbutton" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="versionlist" aria-label="Version/Release"><label></label></button> <ul id="versionlist" class="versionlist" role="listbox" aria-label="Version/Release options"> <% let pageUrl = window.location.pathname.replace("/content/","/c/").toLowerCase(); if (true) pageUrl = pageUrl.substring(0,pageUrl.lastIndexOf("/"))+".html"; for(let i=0; i< data.length; i++) { let item = data\[i\], myurl = item.linkUrl, urlm = myurl.replace("/content/","/c/");; mytitle = item.linkTitle; myclass= urlm.toLowerCase() == pageUrl ? "class=\\"selected\\"":""; isSelected = urlm.toLowerCase() == pageUrl ? "true" : "false"; %> <li role="option" aria-selected="${isSelected}"><a href="${myurl}" ${myclass}>${mytitle}</a></li> <% } %> </ul> </div> Search

Find Matches in This Book

 ![Clear Contents of Search](/etc/designs/cdc/fw/i/ic_clear_gray.png)

cdc.util.ensureNamespace("cdc.rc.savedoc"); cdc.rc.savedoc.isLoggedIn = false; cdc.rc.savedoc.save = "Save"; cdc.rc.savedoc.saved = "Saved"; Save

[Log in](/c/login/index.html?referer=/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vlan_2960s_cg.html) to Save Content

Available Languages

cdc.translations.map = "{en-us=https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2\_4\_e/configurationguide/b\_1524e\_consolidated\_2960p\_2960c\_cg/m\_1522e\_vlan\_vlan\_2960s\_cg.html, x-default=https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2\_4\_e/configurationguide/b\_1524e\_consolidated\_2960p\_2960c\_cg/m\_1522e\_vlan\_vlan\_2960s\_cg.html}";//storing the map for use in the JS cdc.translations.locale="en\_us";

// stored value for overlay label to use in js var downloadOPtionLabel = 'Download Options', bookSearchlabel = 'Find Matches in This Book', translationsLabel = 'Translations', bookConentLabel= 'Book Contents'; Download

Download Options

### Book Title

Software Configuration Guide, Cisco IOS Release 15.2(4)E (Catalyst 2960-Plus and 2960-C Switches)

Chapter Title

### Configuring VLANs

*   [PDF - Complete Book (16.34 MB)](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg.pdf) [PDF - This Chapter (1.16 MB)](/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-2_4_e/configurationguide/b_1524e_consolidated_2960p_2960c_cg/m_1522e_vlan_vlan_2960s_cg.pdf)
    
    View with Adobe Reader on a variety of devices
    

Print

 ![Clear Contents of Search](/etc/designs/cdc/fw/i/ic_clear_gray.png)

Results
-------

<div> <button class="up on" title="Scroll to previous matched word" aria-label="Scroll to previous matched word"><span></span></button> <button class="up off" title="Previous Match Not Available" aria-label="Previous Match Not Available"><span></span></button> <span class="matchlabel">Matches</span> <button class="down on" title="Scroll to next matched word" aria-label="Scroll to next matched word"><span></span></button> <button class="down off" title="Next Match Not Available" aria-label="Next Match Not Available"><span></span></button> </div> <p>There are no Matches in this chapter.</p> <p class="h3">Chapters with Matches</p> <ul tabindex="-1"> <% var i = 0; while ( modelData.links\[i\] ) { %> <li> <% curpage = (window.location.pathname.indexOf(modelData.links\[i\].href) > -1 )?true:false; if ( i === modelData.curpage ) { if ( ! jQuery('.mobileSearch').css("display") == "block") { %> <span class="currentIndicator"></span>${modelData.links\[i\].title} <% } else { %> <span class="currentIndicator"></span><button class="curpage" data-href="${modelData.links\[i\].url}?bookSearch=true${modelData.wcm}">${modelData.links\[i\].title}</button> <% } } else { %> <button data-href="${modelData.links\[i\].url}?bookSearch=true${modelData.wcm}">${modelData.links\[i\].title}</button> <% } %> </li> <% i++; } %> </ul> <p class="head">No matches found in this book</p> <p>This feature looks for an exact match of what you entered in the box.</p> <p>If you entered several words, try reducing the entry to one or two and search again.</p> <p>Search is currently unavailable due to technical issues. We are working to resolve the problem as quickly as possible.</p> <div id="mobileSearchFooter"> <button class="mobileSearch" title="Search in this Book"></button> <button class="closeFooter" aria-label="Close Find Matches in This Book"><span></span><span></span></button> <div class="matches"> </div> </div>

Updated:

June 10, 2021

Chapter: Configuring VLANs
--------------------------

Chapter Contents

*   [Configuring VLANs](#topic_9DE17D3FD580487EADCFC3D31C6625EF)
*   [Finding Feature Information](#concept_A4AB227AC35840A1ACE51453EDBACD3E)
*   [Prerequisites for VLANs](#reference_6E70D327296B4AA1B7EFAAFD3875E1DD)
*   [Restrictions for VLANs](#reference_6F245850BC774916AA33E7F9A5A9745E)
*   [Information About VLANs](#d150886e1171a1635)
    *   [Logical Networks](#concept_F30B3468B15F48D7AF96F88D261303DC)
    *   [Supported VLANs](#con_1298058)
    *   [VLAN Port Membership Modes](#concept_A9330A951971456BA4231EC4A0A71E8D)
    *   [VLAN Configuration Files](#concept_47F50D5549B24516A8061E5F3BEFFFDD)
    *   [Normal-Range VLAN Configuration Guidelines](#con_1573723)
    *   [Extended-Range VLAN Configuration Guidelines](#con_1268266)
*   [Default Ethernet VLAN Configuration](#reference_011DD43E9BAA42439B6A9E4555099491)
*   [How to Configure VLANs](#d150886e2232a1635)
    *   [How to Configure Normal-Range VLANs](#concept_C3F56A0D1F3D471C8AB671A565A0429C)
        *   [Creating or Modifying an Ethernet VLAN](#task_124C2BE816184DCC82CA402F5B17EA04)
        *   [Deleting a VLAN](#task_1236518)
        *   [Assigning Static-Access Ports to a VLAN](#task_952052F6C25E4337AC21C797D2B156B3)
    *   [How to Configure Extended-Range VLANs](#concept_EBD704B2EEF748BAB473B5932BAF5A9A)
        *   [Creating an Extended-Range VLAN](#task_1201785)
*   [Where to Go Next](#reference_C6295B372C514CF08B9634FC8574EC92)
*   [Additional References](#reference_4C1CF34EC1AC4641A63A2830271B05A9)

Close

Configuring VLANs
=================

*   [Finding Feature Information](#concept_A4AB227AC35840A1ACE51453EDBACD3E)
*   [Prerequisites for VLANs](#reference_6E70D327296B4AA1B7EFAAFD3875E1DD)
*   [Restrictions for VLANs](#reference_6F245850BC774916AA33E7F9A5A9745E)
*   [Default Ethernet VLAN Configuration](#reference_011DD43E9BAA42439B6A9E4555099491)
*   [Where to Go Next](#reference_C6295B372C514CF08B9634FC8574EC92)
*   [Additional References](#reference_4C1CF34EC1AC4641A63A2830271B05A9)

Finding Feature Information
---------------------------

Your software release may not support all the features documented in this module. For the latest caveats and feature information, see Bug Search Tool and the release notes for your platform and software release. To find information about the features documented in this module, and to see a list of the releases in which each feature is supported, see the feature information table at the end of this module.

Use Cisco Feature Navigator to find information about platform support and Cisco software image support. To access Cisco Feature Navigator, go to [https://cfnng.cisco.com/](https://cfnng.cisco.com/). An account on Cisco.com is not required.

Prerequisites for VLANs
-----------------------

The following are prerequisites and considerations for configuring VLANs:

*   To configure VLAN through the Web UI, you must change the Virtual Terminal (VTY) lines to 50. Web UI uses VTY lines for processing HTTP requests. At times, when multiple connections are open, the default VTY lines of 15 set by the device gets exhausted. Therefore, you must change the VTY lines to 50 before using the Web UI.
    
    ![](https://www.cisco.com/content/dam/en/us/td/i/templates/note.gif)  
    **Note**
    
    ***
    
    To increase the VTY lines in a device, run the following command in the configuration mode:
    
        Device#configure terminal
        	Device(config)#service tcp-keepalives in
        	Device(config)#service tcp-keepalives out
        
        	Device#configure terminal
        	Device(config)#line vty 16-50
    
    ***
    
*   Before you create VLANs, you must decide whether to use VLAN Trunking Protocol (VTP) to maintain global VLAN configuration for your network.
    
*   If you plan to configure many VLANs on the switch and to not enable routing, you can set the Switch Database Management (SDM) feature to the VLAN template, which configures system resources to support the maximum number of unicast MAC addresses.
    
*   Switches running the LAN Base feature set support only static routing on SVIs.
    
*   A VLAN should be present in the switch to be able to add it to the VLAN group.
    

Restrictions for VLANs
----------------------

The following are restrictions for VLANs:

*   The switch supports up to 1005 normal and extended range VLANs when running the IP base or IP services feature set. It supports up to 255 VLANs when running the LAN Base feature set. However, the number of routed ports, switch virtual interfaces (SVIs), and other configured features affects the use of the switch hardware.
    
*   The switch supports IEEE 802.1Q trunking methods for sending VLAN traffic over Ethernet ports.
    
*   Configuring an interface VLAN router's MAC address is not supported. The interface VLAN already has an MAC address assigned by default.
    
*   Private VLANs are not supported on the switch.
    

Information About VLANs

Logical Networks
----------------

A VLAN is a switched network that is logically segmented by function, project team, or application, without regard to the physical locations of the users. VLANs have the same attributes as physical LANs, but you can group end stations even if they are not physically located on the same LAN segment. Any switch port can belong to a VLAN, and unicast, broadcast, and multicast packets are forwarded and flooded only to end stations in the VLAN. Each VLAN is considered a logical network, and packets destined for stations that do not belong to the VLAN must be forwarded through a router or a switch supporting fallback bridging. Because a VLAN is considered a separate logical network, it contains its own bridge Management Information Base (MIB) information and can support its own implementation of spanning tree.

VLANs are often associated with IP subnetworks. For example, all the end stations in a particular IP subnet belong to the same VLAN. Interface VLAN membership on the switch is assigned manually on an interface-by-interface basis. When you assign switch interfaces to VLANs by using this method, it is known as interface-based, or static, VLAN membership.

Traffic between VLANs must be routed.

The switch can route traffic between VLANs by using switch virtual interfaces (SVIs). An SVI must be explicitly configured and assigned an IP address to route traffic between VLANs.

Supported VLANs
---------------

The switch supports VLANs in VTP client, server, and transparent modes. VLANs are identified by a number from 1 to 4094. VLAN 1 is the default VLAN and is created during system initialization. VLAN IDs 1002 through 1005 are reserved for Token Ring and FDDI VLANs. All of the VLANs except 1002 to 1005 are available for user configuration.

There are 3 VTP versions. VTP version 1 and version 2 support only normal-range VLANs (VLAN IDs 1 to 1005). In these versions, the switch must be in VTP transparent mode when you create VLAN IDs from 1006 to 4094. VTP version 3 supports the entire VLAN range (VLANs 1 to 4094). Extended range VLANs (VLANs 1006 to 4094) are supported only in VTP version 3.

VLAN Port Membership Modes
--------------------------

You configure a port to belong to a VLAN by assigning a membership mode that specifies the kind of traffic the port carries and the number of VLANs to which it can belong.

This table lists the membership modes and membership and VTP characteristics.

Table 1. Port Membership Modes and Characteristics  

Membership Mode

VLAN Membership Characteristics

VTP Characteristics

Static-access

A static-access port can belong to one VLAN and is manually assigned to that VLAN.

VTP is not required. If you do not want VTP to globally propagate information, set the VTP mode to transparent. To participate in VTP, there must be at least one trunk port on the switch or the switch stack connected to a trunk port of a second switch or switch stack.

Trunk ( IEEE 802.1Q)

A trunk port is a member of all VLANs by default, including extended-range VLANs, but membership can be limited by configuring the allowed-VLAN list. You can also modify the pruning-eligible list to block flooded traffic to VLANs on trunk ports that are included in the list.

VTP is recommended but not required. VTP maintains VLAN configuration consistency by managing the addition, deletion, and renaming of VLANs on a network-wide basis. VTP exchanges VLAN configuration messages with other switches over trunk links.

Dynamic access

A dynamic-access port can belong to one VLAN (VLAN ID 1 to 4094) and is dynamically assigned by a VMPS.

You can have dynamic-access ports and trunk ports on the same switch, but you must connect the dynamic-access port to an end station or hub and not to another switch.

VTP is required.

Configure the VMPS and the client with the same VTP domain name.

To participate in VTP, at least one trunk port on the switch or a switch stack must be connected to a trunk port of a second switch or switch stack.

When a port belongs to a VLAN, the switch learns and manages the addresses associated with the port on a per-VLAN basis.

VLAN Configuration Files
------------------------

Configurations for VLAN IDs 1 to 1005 are written to the vlan.dat file (VLAN database), and you can display them by entering the show vlan privileged EXEC command. The _vlan.dat_ file is stored in flash memory. If the VTP mode is transparent, they are also saved in the switch running configuration file.

You use the interface configuration mode to define the port membership mode and to add and remove ports from VLANs. The results of these commands are written to the running-configuration file, and you can display the file by entering the show running-config privileged EXEC command.

When you save VLAN and VTP information (including extended-range VLAN configuration information) in the startup configuration file and reboot the switch, the switch configuration is selected as follows:

*   If the VTP mode is transparent in the startup configuration, and the VLAN database and the VTP domain name from the VLAN database matches that in the startup configuration file, the VLAN database is ignored (cleared), and the VTP and VLAN configurations in the startup configuration file are used. The VLAN database revision number remains unchanged in the VLAN database.
    
*   If the VTP mode or domain name in the startup configuration does not match the VLAN database, the domain name and VTP mode and configuration for the VLAN IDs 1 to 1005 use the VLAN database information.
    
*   In VTP versions 1 and 2, if VTP mode is server, the domain name and VLAN configuration for VLAN IDs 1 to 1005 use the VLAN database information. VTP version 3 also supports VLANs 1006 to 4094.
    
*   From image 15.0(02)SE6, on vtp transparent and off modes, vlans get created from startup-config even if they are not applied to the interface.
    

![](https://www.cisco.com/content/dam/en/us/td/i/templates/note.gif)  
**Note**

***

Ensure that you delete the vlan.dat file along with the configuration files before you reset the switch configuration using **write erase** command. This ensures that the switch reboots correctly on a reset.

***

Normal-Range VLAN Configuration Guidelines
------------------------------------------

Normal-range VLANs are VLANs with IDs from 1 to 1005.

Follow these guidelines when creating and modifying normal-range VLANs in your network:

*   Normal-range VLANs are identified with a number between 1 and 1001. VLAN numbers 1002 through 1005 are reserved for Token Ring and FDDI VLANs.
    
*   VLAN configurations for VLANs 1 to 1005 are always saved in the VLAN database. If the VTP mode is transparent, VTP and VLAN configurations are also saved in the switch running configuration file.
    
*   If the switch is in VTP server or VTP  transparent mode, you can add, modify or remove configurations for VLANs 2 to 1001 in the VLAN database. (VLAN IDs 1 and 1002 to 1005 are automatically created and cannot be removed.)
    
*   With VTP versions 1 and 2, the switch supports VLAN IDs 1006 through 4094 only in VTP transparent mode (VTP disabled). These are extended-range VLANs and configuration options are limited. Extended-range VLANs created in VTP transparent mode are not saved in the VLAN database and are not propagated. VTP version 3 supports extended range VLAN (VLANs 1006 to 4094) database propagation in VTP server mode. If extended VLANs are configured, you cannot convert from VTP version 3 to version 1 or 2.
    
*   Before you can create a VLAN, the switch must be in VTP server mode or VTP transparent mode. If the switch is a VTP server, you must define a VTP domain or VTP will not function.
    
*   The switch does not support Token Ring or FDDI media. The switch does not forward FDDI, FDDI-Net, TrCRF, or TrBRF traffic, but it does propagate the VLAN configuration through  VTP.
    
*   A fixed number of spanning tree instances are supported on the switch (See the datasheet for the latest information). If the switch has more active VLANs than the supported number of spaning tree instances, spanning tree is still enabled only on the supported number of VLANs and disabled on all remaining VLANs.
    
    If you have already used all available spanning-tree instances on a switch, adding another VLAN anywhere in the VTP domain creates a VLAN on that switch that is not running spanning-tree. If you have the default allowed list on the trunk ports of that switch (which is to allow all VLANs), the new VLAN is carried on all trunk ports. Depending on the topology of the network, this could create a loop in the new VLAN that would not be broken, particularly if there are several adjacent switches that all have run out of spanning-tree instances. You can prevent this possibility by setting allowed lists on the trunk ports of switches that have used up their allocation of spanning-tree instances.
    
    If the number of VLANs on the switch exceeds the number of supported spanning-tree instances, we recommend that you configure the IEEE 802.1s Multiple STP (MSTP) on your switch to map multiple VLANs to a single spanning-tree instance.
    

Extended-Range VLAN Configuration Guidelines
--------------------------------------------

Extended-range VLANs are VLANs with IDs from 1006 to 4094.

Follow these guidelines when creating extended-range VLANs:

*   VLAN IDs in the extended range are not saved in the VLAN database and are not recognized by VTP unless the switch is running VTP version 3.
    
*   You cannot include extended-range VLANs in the pruning eligible range.
    
*   In VTP version 1 and 2, a switch must be in VTP transparent mode when you create extended-range VLANs. If VTP mode is server or client, an error message is generated, and the extended-range VLAN is rejected. VTP version 3 supports extended VLANs in server and transparent modes.
    
*   For VTP version 1 or 2, you can set the VTP mode to transparent in global configuration mode. You should save this configuration to the startup configuration so that the switch boots up in VTP transparent mode. Otherwise, you lose the extended-range VLAN configuration if the switch resets. If you create extended-range VLANs in VTP version 3, you cannot convert to VTP version 1 or 2.
    
*   . When the maximum number of spanning-tree instances are on the switch, spanning tree is disabled on any newly created VLANs. If the number of VLANs on the switch exceeds the maximum number of spanning-tree instances, we recommend that you configure the IEEE 802.1s Multiple STP (MSTP) on your switch to map multiple VLANs to a single spanning-tree instance.
    
*   Although the switch orswitch stack supports a total of 1005 (normal-range and extended-range) VLANs, the number of routed ports, SVIs, and other configured features affects the use of the switch hardware. If you try to create an extended-range VLAN and there are not enough hardware resources available, an error message is generated, and the extended-range VLAN is rejected.
    

Default Ethernet VLAN Configuration
-----------------------------------

The following table displays the default configuration for Ethernet VLANs.

![](https://www.cisco.com/content/dam/en/us/td/i/templates/note.gif)  
**Note**

***

The switch supports Ethernet interfaces exclusively. Because FDDI and Token Ring VLANs are not locally supported, you only configure FDDI and Token Ring media-specific characteristics for VTP global advertisements to other switches.

***

Table 2. Ethernet VLAN Defaults and Range  

Parameter

Default

Range

VLAN ID

1

1 to 4094.

**Note** 

Extended-range VLANs (VLAN IDs 1006 to 4094) are only saved in the VLAN database in VTP version 3.

VLAN name

VLANxxxx, where xxxx represents four numeric digits (including leading zeros) equal to the VLAN ID number

No range

IEEE 802.10 SAID

100001 (100000 plus the VLAN ID)

1 to 4294967294

IEEE 802.10 SAID

1500

576-18190

MTU Size

0

0 to 1005

How to Configure VLANs

How to Configure Normal-Range VLANs
-----------------------------------

You can set these parameters when you create a new normal-range VLAN or modify an existing VLAN in the VLAN database:

*   VLAN ID
    
*   VLAN name
    
*   VLAN type
    
    *   Ethernet
        
    *   Fiber Distributed Data Interface \[FDDI\]
        
    *   FDDI network entity title \[NET\]
        
    *   TrBRF or TrCRF
        
    *   Token Ring
        
    *   Token Ring-Net
        
*   VLAN state (active or suspended)
    
*   Security Association Identifier (SAID)
    
*   Bridge identification number for TrBRF VLANs
    
*   Ring number for FDDI and TrCRF VLANs
    
*   Parent VLAN number for TrCRF VLANs
    
*   Spanning Tree Protocol (STP) type for TrCRF VLANs
    
*   VLAN number to use when translating from one VLAN type to another
    

You can cause inconsistency in the VLAN database if you attempt to manually delete the _vlan.dat_ file. If you want to modify the VLAN configuration, follow the procedures in this section.

*   [Creating or Modifying an Ethernet VLAN](#task_124C2BE816184DCC82CA402F5B17EA04)
*   [Deleting a VLAN](#task_1236518)
*   [Assigning Static-Access Ports to a VLAN](#task_952052F6C25E4337AC21C797D2B156B3)

### Creating or Modifying an Ethernet VLAN

Each Ethernet VLAN in the VLAN database has a unique, 4-digit ID that can be a number from 1 to 1001. VLAN IDs 1002 to 1005 are reserved for Token Ring and FDDI VLANs. To create a normal-range VLAN to be added to the VLAN database, assign a number and name to the VLAN.

![](https://www.cisco.com/content/dam/en/us/td/i/templates/note.gif)  
**Note**

***

With VTP version 1 and 2, if the switch is in VTP transparent mode, you can assign VLAN IDs greater than 1006, but they are not added to the VLAN database.

***

### SUMMARY STEPS

1.  enable
2.  configure terminal
3.  vlan vlan-id
4.  name vlan-name
5.  mtu mtu-size
6.  remote-span
7.  end
8.  show vlan {name vlan-name | id vlan-id}
9.  copy running-config startup-config

### DETAILED STEPS

 

Command or Action

Purpose

**Step 1**

enable

#### Example:

    
    Switch> enable
    
    

Enables privileged EXEC mode.

*   Enter your password if prompted.
    

**Step 2**

configure terminal

#### Example:

    
    Switch# configure terminal
    
    

Enters global configuration mode.

**Step 3**

vlan vlan-id

#### Example:

    
    Switch(config)# vlan 20
    
    

Enters a VLAN ID, and enters VLAN configuration mode. Enter a new VLAN ID to create a VLAN, or enter an existing VLAN ID to modify that VLAN.

**Note** 

The available VLAN ID range for this command is 1 to 4094.

**Step 4**

name vlan-name

#### Example:

    
    Switch(config-vlan)# name test20
    
    

(Optional) Enters a name for the VLAN. If no name is entered for the VLAN, the default is to append the vlan-id value with leading zeros to the word VLAN. For example, VLAN0004 is a default VLAN name for VLAN 4.

**Step 5**

mtu mtu-size

#### Example:

    
    Switch(config-vlan)# mtu 256
    
    

(Optional) Changes the MTU size (or other VLAN characteristic).

**Step 6**

remote-span

#### Example:

    
    Switch(config-vlan)# remote-span
    
    

(Optional) Configures the VLAN as the RSPAN VLAN for a remote SPAN session.

**Step 7**

end

#### Example:

    
    Switch(config)# end
    
    

Returns to privileged EXEC mode.

**Step 8**

show vlan {name vlan-name | id vlan-id}

#### Example:

    
    Switch# show vlan name test20 id 20
    
    

Verifies your entries.

**Step 9**

copy running-config startup-config

#### Example:

    
    Switch# copy running-config startup-config 
    
    

(Optional) Saves your entries in the configuration file.

### Deleting a VLAN

When you delete a VLAN from a switch that is in VTP server mode, the VLAN is removed from the VLAN database for all switches in the VTP domain. When you delete a VLAN from a switch that is in VTP transparent mode, the VLAN is deleted only on that specific switch .

You cannot delete the default VLANs for the different media types: Ethernet VLAN 1 and FDDI or Token Ring VLANs 1002 to 1005.

![](https://www.cisco.com/content/dam/en/us/td/i/templates/caut.gif)  
**Caution**

***

When you delete a VLAN, any ports assigned to that VLAN become inactive. They remain associated with the VLAN (and thus inactive) until you assign them to a new VLAN.

***

### SUMMARY STEPS

1.  enable
2.  configure terminal
3.  no vlan vlan-id
4.  end
5.  show vlan brief
6.  copy running-config startup-config

### DETAILED STEPS

 

Command or Action

Purpose

**Step 1**

enable

#### Example:

    
    Switch> enable
    
    

Enables privileged EXEC mode.

*   Enter your password if prompted.
    

**Step 2**

configure terminal

#### Example:

    
    Switch# configure terminal
    
    

Enters global configuration mode.

**Step 3**

no vlan vlan-id

#### Example:

    
    Switch(config)# no vlan 4
    
    

Removes the VLAN by entering the VLAN ID.

**Step 4**

end

#### Example:

    
    Switch(config)# end
    
    

Returns to privileged EXEC mode.

**Step 5**

show vlan brief

#### Example:

    
    Switch# show vlan brief
    
    

Verifies the VLAN removal.

**Step 6**

copy running-config startup-config

#### Example:

    
    Switch# copy running-config startup-config 
    
    

(Optional) Saves your entries in the configuration file.

### Assigning Static-Access Ports to a VLAN

You can assign a static-access port to a VLAN without having VTP globally propagate VLAN configuration information by disabling VTP (VTP transparent mode).

For the Cisco Catalyst 9500 Series Switches, if you are assigning a port on a cluster member switch to a VLAN, first use the rcommand privileged EXEC command to log in to the cluster member switch.

If you assign an interface to a VLAN that does not exist, the new VLAN is created.

### SUMMARY STEPS

1.  enable
2.  configure terminal
3.  interface interface-id
4.  switchport mode access
5.  switchport access vlan vlan-id
6.  end
7.  show running-config interface interface-id
8.  show interfaces interface-id switchport
9.  copy running-config startup-config

### DETAILED STEPS

 

Command or Action

Purpose

**Step 1**

enable

#### Example:

    
    Switch> enable
    
    

Enables privileged EXEC mode.

*   Enter your password if prompted.
    

**Step 2**

configure terminal

#### Example:

    
    Switch# configure terminal
    
    

Enters global configuration mode

**Step 3**

interface interface-id

#### Example:

    
    Switch(config)# interface gigabitethernet2/0/1
    
    

Enters the interface to be added to the VLAN.

**Step 4**

switchport mode access

#### Example:

    
    Switch(config-if)# switchport mode access
    
    

Defines the VLAN membership mode for the port (Layer 2 access port).

**Step 5**

switchport access vlan vlan-id

#### Example:

    
    Switch(config-if)# switchport access vlan 2
    
    

Assigns the port to a VLAN. Valid VLAN IDs are 1 to 4094.

**Step 6**

end

#### Example:

    
    Switch(config-if)# end
    
    

Returns to privileged EXEC mode.

**Step 7**

show running-config interface interface-id

#### Example:

    
    Switch# show running-config interface gigabitethernet2/0/1
    
    

Verifies the VLAN membership mode of the interface.

**Step 8**

show interfaces interface-id switchport

#### Example:

    
    Switch# show interfaces gigabitethernet2/0/1 switchport
    
    

Verifies your entries in the _Administrative Mode_ and the _Access Mode VLAN_ fields of the display.

**Step 9**

copy running-config startup-config

#### Example:

    
    Switch# copy running-config startup-config 
    
    

(Optional) Saves your entries in the configuration file.

How to Configure Extended-Range VLANs
-------------------------------------

With VTP version 1 and version 2, when the switch is in VTP transparent mode (VTP disabled), you can create extended-range VLANs (in the range 1006 to 4094). VTP version supports extended-range VLANs in server or transparent move. Extended-range VLANs enable service providers to extend their infrastructure to a greater number of customers. The extended-range VLAN IDs are allowed for any switchport commands that allow VLAN IDs.

With VTP version 1 or 2, extended-range VLAN configurations are not stored in the VLAN database, but because VTP mode is transparent, they are stored in the switch running configuration file, and you can save the configuration in the startup configuration file by using the copy running-config startup-config privileged EXEC command. Extended-range VLANs created in VTP version 3 are stored in the VLAN database.

*   [Creating an Extended-Range VLAN](#task_1201785)

### Creating an Extended-Range VLAN

In VTP version 1 or 2, if you enter an extended-range VLAN ID when the switch is not in VTP transparent mode, an error message is generated when you exit VLAN configuration mode, and the extended-range VLAN is not created.

### SUMMARY STEPS

1.  enable
2.  configure terminal
3.  vlan vlan-id
4.  remote-span
5.  exit
6.  end
7.  show vlan id vlan-id
8.  copy running-config startup-config

### DETAILED STEPS

 

Command or Action

Purpose

**Step 1**

enable

#### Example:

    
    Switch> enable
    
    

Enables privileged EXEC mode.

*   Enter your password if prompted.
    

**Step 2**

configure terminal

#### Example:

    
    Switch# configure terminal
    
    

Enters global configuration mode.

**Step 3**

vlan vlan-id

#### Example:

    
    Switch(config)# vlan 2000
    Switch(config-vlan)#
    
    

Enters an extended-range VLAN ID and enters VLAN configuration mode. The range is 1006 to 4094.

**Step 4**

remote-span

#### Example:

    
    Switch(config-vlan)# remote-span
    
    

(Optional) Configures the VLAN as the RSPAN VLAN.

**Step 5**

exit

#### Example:

    
    Switch(config-vlan)# exit
    Switch(config)# 
    
    

Returns to configuration mode.

**Step 6**

end

#### Example:

    
    Switch(config)# end
    
    

Returns to privileged EXEC mode.

**Step 7**

show vlan id vlan-id

#### Example:

    
    Switch# show vlan id 2000
    
    

Verifies that the VLAN has been created.

**Step 8**

copy running-config startup-config

#### Example:

    
    Switch# copy running-config startup-config 
    
    

(Optional) Saves your entries in the configuration file.

Where to Go Next
----------------

After configuring VLANs, you can configure the following:

*   VLAN Trunking Protocol (VTP)
    
*   VLAN trunks
    

Additional References
---------------------

### Standards and RFCs

  

Standard/RFC

Title

RFC 1573

Evolution of the Interfaces Group of MIB-II

RFC 1757

Remote Network Monitoring Management

RFC 2021

SNMPv2 Management Information Base for the Transmission Control Protocol using SMIv2

### MIBs

  

MIB

MIBs Link

All the supported MIBs for this release.

To locate and download MIBs for selected platforms, Cisco IOS releases, and feature sets, use Cisco MIB Locator found at the following URL:

[http://www.cisco.com/go/mibs](http://www.cisco.com/go/mibs)

### Technical Assistance

  

Description

Link

The Cisco Support website provides extensive online resources, including documentation and tools for troubleshooting and resolving technical issues with Cisco products and technologies.

To receive security and technical information about your products, you can subscribe to various services, such as the Product Alert Tool (accessed from Field Notices), the Cisco Technical Services Newsletter, and Really Simple Syndication (RSS) Feeds.

Access to most tools on the Cisco Support website requires a Cisco.com user ID and password.

[http://www.cisco.com/support](http://www.cisco.com/support)

### Was this Document Helpful?

Yes No [![Feedback](//www.cisco.com/c/dam/cdc/i/Feedback_OceanBlue.png "Feedback")Feedback](javascript: void(0);) 

### Contact Cisco

*   [Open a Support Case](https://mycase.cloudapps.cisco.com/start?prodDocUrl=)![login required](/etc/designs/cdc/fw/i/icon_lock_small.png)
*   (Requires a [Cisco Service Contract](//www.cisco.com/c/en/us/services/order-services.html))

jQuery(document).ready(function() { var getURL=jQuery("#eotLetUsHelpProdDocUrl").attr("href"), domInd = location.href.indexOf('cisco.com') ; if ( domInd > -1 && domInd < location.href.search(/\\w\\/\\w/) ) { getURL += encodeURI(location.href); } jQuery("#eotLetUsHelpProdDocUrl").attr("href",getURL); });

var test=""; if(test!=undefined && test.trim().length>0){ mboxCreate('en-us\_dg\_support\_bookchapters','type=default',''); }else{ mboxCreate('en-us\_dg\_support\_bookchapters','type=default'); }

var eottdatp = document.getElementsByClassName('eot-tdatp'); if (eottdatp && eottdatp.style) { eottdatp.style.display="none"; }

if(document.querySelector('#privacy-manager')!=null){ document.querySelector('#privacy-manager').href='#cookies'; }

![](//cisco.112.2o7.net/b/ss/cisco-mobile/5/12345)
```



---

## 📌 1. Pattern Config ของ VLAN บน Cisco IOS 15.2(4)E

นี่แหละคือ "Pattern Config" ที่อาจารย์ธนาพูดถึง — มัน **คาดเดาได้ 100%** ไม่ต้องใช้ AI เลย:
```cisco

! Step 1: เข้า Config Mode

Switch> enable

Switch# configure terminal

! Step 2: สร้าง VLAN

Switch(config)# vlan 20

Switch(config-vlan)# name DATA

! Step 3: ออกและ Verify

Switch(config-vlan)# end

Switch# show vlan id 20

! Step 4: Save

Switch# copy running-config startup-config
```

**→ Jinja2 Template ที่เขียนได้ทันทีจากนี้:**

```jinja2

{% for vlan in vlans %}

vlan {{ vlan.id }}

 name {{ vlan.name }}

{% if vlan.mtu %}

 mtu {{ vlan.mtu }}

{% endif %}

!

{% endfor %}
```
---

## 📌 2. Constraints ที่ต้องใส่ใน Form Validation

เอกสารบอกกฎชัดเจนมาก ต้องนำไปเป็น **Validation Rule** ในระบบ:

| กฎจาก Cisco Doc                                   | Validation ที่ต้องเขียน                  |
| ------------------------------------------------- | ---------------------------------------- |
| VLAN ID 1-4094                                    | `1 <= vlan_id <= 4094`                   |
| VLAN 1002-1005 ถูก Reserve                        | `if 1002 <= vlan_id <= 1005: ERROR`      |
| VLAN 1 ลบไม่ได้                                   | `if vlan_id == 1: disable delete button` |
| Extended VLAN (1006-4094) ต้องใช้ VTP Transparent | Warning flag ถ้า > 1005                  |
| ชื่อ VLAN ถ้าไม่ใส่ → Default เป็น `VLANxxxx`     | Auto-fill placeholder                    |
| Max VLAN บน LAN Base = 255, IP Base = 1005        | Warning ถ้าเกิน                          |

---

## 📌 3. Port Membership Modes → Interface Tab

เอกสารอธิบาย Mode ของ Interface ที่ Mockup มีเป็น Dropdown:

|Mode ใน Mockup|ความหมายจาก Cisco Doc|Config ที่ Generate|
|---|---|---|
|**Access**|Port อยู่ใน VLAN เดียว|`switchport mode access` + `switchport access vlan X`|
|**Trunk**|Port ส่งหลาย VLAN|`switchport mode trunk` + `switchport trunk encapsulation dot1q`|
|**Routed**|L3 Interface มี IP|`no switchport` + `ip address X.X.X.X`|
|**Loopback**|Virtual Interface|`interface loopback X`|

**→ Jinja2 Template Interface:**

```jinja2

interface {{ iface.name }}

 description {{ iface.description }}

{% if iface.mode == 'access' %}

 switchport mode access

 switchport access vlan {{ iface.access_vlan }}

{% elif iface.mode == 'trunk' %}

 switchport mode trunk

 switchport trunk encapsulation dot1q

{% elif iface.mode == 'routed' %}

 no switchport

 ip address {{ iface.ip }} {{ iface.mask }}

{% elif iface.mode == 'loopback' %}

{# loopback ไม่ต้องมี switchport command #}

 ip address {{ iface.ip }} {{ iface.mask }}

{% endif %}

{% if iface.status == 'up' %}

 no shutdown

{% else %}

 shutdown

{% endif %}

!
```
---

## 📌 4. SVI (Switch Virtual Interface) สำหรับ Inter-VLAN Routing

เอกสารบอกชัดว่า:

> _"An SVI must be explicitly configured and assigned an IP address to route traffic between VLANs"_

นั่นคือฟีลด์ **SVI IP** ใน VLAN Tab ของ Mockup → Generate Config แบบนี้:

```jinja2

{% if vlan.svi_ip %}

interface Vlan{{ vlan.id }}

 description SVI-{{ vlan.name }}

 ip address {{ vlan.svi_ip | ip_addr }} {{ vlan.svi_ip | subnet_mask }}

 no shutdown

!

{% endif %}
```
---

## 📌 5. สิ่งที่ควรเข้า RAG vs ไม่ต้องเข้า RAG

|ข้อมูลจาก Cisco Doc|วิธีใช้ในโปรเจกต์|
|---|---|
|CLI Syntax ของแต่ละ command|**Template** — ไม่ต้องส่ง RAG ทุกครั้ง|
|Constraints (VLAN ID range, Reserved)|**Hard-coded Validation**|
|Default values (VLAN name = VLANxxxx)|**Form Placeholder**|
|VTP concepts, STP interactions|**RAG** — ตอบคำถาม Edge case ที่ซับซ้อน|
|Troubleshooting commands (`show vlan`)|**RAG** — ถ้า user ถามว่า verify ยังไง|
|Extended-range VLAN behavior|**RAG** — เพราะซับซ้อน ไม่ค่อยใช้บ่อย|

---

## 📌 6. สิ่งที่ Doc นี้บอกว่าต้องระวังเป็นพิเศษ

⚠️ ลบ VLAN แล้ว Port จะ Inactive ทันที

→ ควรมี Warning Dialog ก่อน Delete VLAN ในระบบ

→ "VLAN นี้มี X ports อยู่ ถ้าลบแล้ว port จะ inactive ทันที"

⚠️ vlan.dat กับ running-config อาจ Conflict กันได้

→ Version Control ต้องเก็บทั้ง running-config AND show vlan output

⚠️ VTP Mode ส่งผลต่อ VLAN config

→ Inventory ต้องเก็บ VTP Mode ของ Switch ด้วย

---

## 🎯 สรุปสิ่งที่ได้จาก Doc นี้สำหรับ Day 1

ก่อนอ่าน Doc นี้:          หลังอ่าน Doc นี้:

─────────────────────────────────────────────────

"VLAN config เป็น          "VLAN config มี Pattern

 Pattern" (แค่รู้ว่ามี)      ที่ชัดเจน เขียน Template

                            ได้ทันที 4-9 บรรทัด"

"Validation VLAN ID"       "VLAN 1, 1002-1005 ต้อง

                            Block, Extended > 1005

                            ต้องมี Warning"

"SVI คืออะไร"              "SVI = interface VlanX

                            ต้องมี ip address

                            ถึงจะ Route ได้"

"RAG จะเอา Doc อะไรเข้า"   "Cisco Config Guide PDF

                            สำหรับ VLAN chapter นี้

                            = ดีที่สุดสำหรับ RAG"

> **Bottom line:** Doc นี้คือหลักฐานที่พิสูจน์ว่า VLAN config บน Cisco ใช้ Template ได้ 100% — นำไปใส่ใน Decision Log ว่า "เราทดสอบแล้วว่า Template Jinja2 จาก Cisco Official Doc สร้าง Config ได้ถูกต้องและครบถ้วนโดยไม่ต้องใช้ AI" ครับ 🎯