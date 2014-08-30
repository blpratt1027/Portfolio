<!DOCTYPE html>
<!-- Portfolio Home -->
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="Expires" content="-1">
    <meta http-equiv="Pragma" content="no-cache">
    <!--[if lt IE 9]>
          <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
     <![endif]-->
    <link rel="stylesheet" href="css/HTML5_CSSReset.css">
    <link rel="stylesheet" href="css/portfolio_main.css">
    <link rel="stylesheet" href="css/portfolio_tab.css">
    <link rel="stylesheet" href="css/resume.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/humanity/jquery-ui.css">
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="Gallery/js/jquery.storageapi.min.js"></script>

	 <link rel="shortcut icon" href="images/assets/Portfolio.png">
    <title>Bryan L. Pratt &ndash; Portfolio</title>
</head>
<body>
    <p class="faux_hidden" id="top">Top</p>
    <div id="tabs">
        <ul>
            <li id="port" class="tab-id"><a href="#portfolio_tab">Portfolio</a> </li>
            <li id="res" class="tab-id"><a href="#resume_tab">R&eacute;sum&eacute; </a> </li>
            <!--<li><a href="#about_tab">Interests</a> </li>-->
            <li id="cont" class="tab-id"><a href="#contact_tab">Contact Me</a> </li>
        </ul>
        <div id="portfolio_tab">
            <h1 class="title">Bryan L. Pratt's Portfolio</h1>
            <h5>Click any image below...</h5>

            <div id="images_wrapper">
                <div class="img-wrapper">
                    <a href="WellKit/Portfolio.pdf" title="WellKit Portfolio" target="_self">
                        <figure>
                            <img src="images/WellKit.jpg" alt="WellKit Portfolio">
                        </figure>
                    </a>
                    <h4>Description...</h4>
                    <div class="hidden description-text">
                        <h2>WellKit Internship Portfolio</h2>
                        <p>I did an internship with WellKit Corporation in Bellevue, Washington during Summer 2013
                            quarter.  I helped in the creation of a web site for the company.  This report describes
                            the work I did there in detail.</p>
                        <table>
                            <tr>
                                <td class="td-align-bottom" colspan="2">
                                    <a href="https://www.linkedin.com/profile/view?id=122017472&authType=NAME_SEARCH&authToken=dYgW&locale=en_US&trk=tyah2&trkInfo=tarId%3A1409411411873%2Ctas%3Amichael%20kysar%2Cidx%3A1-1-1"
                                       title="Click to see Michael's LinkedIn Profile" target="_blank">
                                        <img class="float-left portrait-img" src="images/Michael.jpg" />
                                    </a>
                                    <p>At WellKit, I worked with Michael Kysar, President and lead software developer.
                                    Michael worked for nine years at Microsoft, where he was technical writer and online
                                    documentation team lead on Excel, Visual Basic, and Access, and program manager on
                                    the original MSNBC web site team.  Here is what he had to say about my work at
                                    WellKit:</p>
                                </td>
                            </tr>
                            <tr class="quote">
                                <td class="td-align-bottom"></td>
                                <td>
                                    <p><span class="big-quo">&ldquo;</span> Bryan served as a programmer on a project
                                    for the WellKit website. From the day he walked in, he was always prepared,
                                    creative, and capable. His internship was from June through September of 2013, and
                                    I was both his manager and as the other developer on the project, his colleague.</p>
                                    <p><span class="big-quo">&ldquo;</span> His first tasks were to implement some
                                    design modifications and fix bugs in existing <span class="emph">ASP.NET</span>
                                    pages in <span class="emph">HTML</span> and <span class="emph">CSS</span>. The next
                                    tasks involved creating code for several kinds of data to implement utility
                                    operations in our framework code and SQL database.</p>
                                    <p><span class="big-quo">&ldquo;</span> One morning, he was given an assignment to
                                    <span class="emph"> write a spec</span> for a new page, and to have it completed by
                                    end of day. I gave him the goals for the page and its accompanying admin page, and
                                    how the users and admins would interact with them. He came up with a very workable
                                    layout and technical design by end of day. The next few weeks were spent
                                    implementing his spec in both <span class="emph">ASP.NET</span> WebPages using
                                    <span class="emph">C#</span> and in <span class="emph">SQL Server</span>, testing,
                                    getting reviews and updating the pages and code. In <span class="emph">SQL Server,
                                    </span> this task involved <span class="emph"> designing and creating tables,
                                    indexes</span>, and <span class="emph">TSQL stored procedures</span> required to
                                    make it operational. He also updated his spec with any changes that were
                                    required.</p>
                                    <p><span class="big-quo">&ldquo;</span> During his time at WellKit, he also updated
                                    our <span class="emph">CSS</span> files to include some spiffy new ideas, and to
                                    give the whole site a more consistent look.</p>
                                    <p><span class="big-quo">&ldquo;</span> Bryan was very easy to have around, and a
                                    delight to work with. I am sure that he would make a solid contribution to any
                                    development team. <span class="big-quo">&rdquo;</span></p>
                                </td>
                            </tr>
                        </table>
                        <h4><a href="http://www.linkedin.com/in/bryanpratt" title="Click to see my LinkedIn Profile">
                            This endorsement can be found on my LinkedIn Profile.</a></h4>
                        <div class="center-text">
                            <p class="close-button center-text">Close</p>
                        </div>
                    </div>
                </div>
                <div class="img-wrapper">
                    <a href="Gallery/index.html" title="Gallery" target="_self">
                        <figure>
                            <img src="images/gallery.jpg" alt="Gallery">
                        </figure>
                    </a>
                    <div class="item-description">
                        <h4>Description...</h4>
                        <div class="hidden description-text">
                            <h2>Gallery</h2>
                            <p>A simulated commercial photo gallery featuring three slide shows and a light box.
                                “Customers” can “order” prints of each of the photos in various sizes.  This was the
                                “capstone” project for my last client-side programming class at Bellevue College.</p>
                            <p>This site was built using JavaScript, jQuery, jQuery UI, AJAX / JSON, and OWL Graphic’s
                                OWL Carousel jQuery plugin.</p>
                            <p>The code for this site can be used for different galleries by simply providing a
                                different set of images, and a JSON file containing the paths and file names of the
                                images, descriptions, and prices for the images.  Only the reference to the JSON file
                                has to be changed in the code.</p>
                            <p>I looked at several plugins for the light box, but could not find one that provided the
                                flexibility for what I had in mind, so I created my own.  I also wrote my own data
                                validator for the same reason.</p>
                            <p>Dialog boxes (including the light box) are created dynamically, and are modal and
                                draggable.</p>
                            <p>While not a major design goal, the site does implement some principles of responsive web
                                design, especially for the light box.  While not yet optimized for a small hand-held
                                device, the site should work well on a tablet.</p>
                            <h4 class="github-link"><a href="https://github.com/blpratt1027/Portfolio/tree/master/Gallery"
                               title="Click here to see Gallery source code" target="_blank">Click here to see the code
                                for this project on GitHub.</a></h4>
                            <div class="center-text">
                                <p class="close-button center-text">Close</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="img-wrapper">
                    <a href="calc/index.html" title="Calculator" target="_self">
                        <figure>
                            <img src="images/calc_app.jpg" alt="Calculator">
                        </figure>
                    </a>
                    <h4>Description...</h4>
                    <div class="hidden description-text">
                        <h2>Calculator</h2>
                        <p>A multi-function calculator was written using JavaScript, jQuery, and jQuery UI for an
                            assignment in a client-side programming class at Bellevue College.</p>
                        <p>This app follows the principles of responsive web design, setting the size of each element
                            in code on load, and readjusting sizes proportionately every time the browser window is
                            resized.  It resizes down to the size of a small, hand-held device.</p>
                        <p>The calculator is draggable.</p>
                        <h4 class="github-link"><a href="https://github.com/blpratt1027/Portfolio/tree/master/calc"
                           title="Click here to see Calculator source code" target="_blank">Click here to see the code
                            for this project on GitHub.</a></h4>
                        <div class="center-text">
                            <p class="close-button center-text">Close</p>
                        </div>
                    </div>
                </div>
                <div class="img-wrapper">
                    <a href="Quiz/select.html" title="Quiz" target="_self">
                        <figure>
                            <img src="images/quiz_app.jpg" alt="Quiz">
                        </figure>
                    </a>
                    <h4>Description...</h4>
                    <div class="hidden description-text">
                        <h2>Quiz</h2>
                        <p>This app was written in JavaScript, jQuery and AJAX / JSON as an assignment for a client-side
                            programming class at Bellevue College.</p>
                        <p>Three quizzes are available for the app to demonstrate that different quizzes can be
                            presented simply by changing the JSON file where the quiz data is stored and the images
                            associated with the quiz.  All three quizzes use the same code.</p>
                        <p>This app follows principles of responsive web design using CSS media queries.</p>
                        <h4 class="github-link"><a href="https://github.com/blpratt1027/Portfolio/tree/master/Quiz"
                           title="Click here to see Quiz source code" target="_blank">Click here to see the code
                            for this project on GitHub.</a></h4>
                        <div class="center-text">
                            <p class="close-button center-text">Close</p>
                        </div>
                    </div>
                </div>
                <div class="img-wrapper">
                    <a href="Uplift/index.html" title="Shafts of Light" target="_self">
                        <figure>
                            <img src="images/uplift_app.jpg" alt="Shafts of Light">
                        </figure>
                    </a>
                    <h4>Description...</h4>
                    <div class="hidden description-text">
                        <h2>Shafts of Light</h2>
                        <p>This is a personal blog that I wrote on my own to practice jQuery methods that I was learning
                            at Bellevue College.  It follows principles of responsive web design using CSS media
                            queries.</p>
                        <p>I hope to expand on this blog as a place to share stories that help to demonstrate that
                            goodness and kindness still exist in an increasingly greedy and self-absorbed world.</p>
                        <h4 class="github-link"><a href="https://github.com/blpratt1027/Portfolio/tree/master/Uplift"
                           title="Click here to see Shafts of Light source code" target="_blank">Click here to see the code
                            for this project on GitHub.</a></h4>
                        <div class="center-text">
                            <p class="close-button center-text">Close</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div id="resume_tab">
            <div id="resume_content" class="resume">
                <h1>
                    <a href="https://www.linkedin.com/in/bryanpratt" title="Click to see my LinkedIn Profile" target="_blank">
                        Bryan L. Pratt, Web Developer
                    </a>
                </h1>

                <ul class="contact">
                    <li><a href="mailto:blpratt1027@gmail.com">Email: blpratt1027@gmail.com</a></li> |
                    <li><a href="https://www.linkedin.com/in/bryanpratt" title="Click to see my LinkedIn Profile"
                       target="_blank"> LinkedIn: linkedin.com/in/bryanpratt</a></li> |
                    <li><a href="https://github.com/blpratt1027/Portfolio"
                       target="_blank"> GitHub: github.com/blpratt1027/Portfolio</a></li> |
                    <li><a href="tel:4252163748"> Phone: (425) 216-3748</a></li>
                </ul>
                <div id="value_statement" class="statement">
                    <p>Passion for excellence, a strong work ethic, analytical thinking and problem solving skills,
                        maturity developed over a lifetime of eclectic work experiences, and a rapidly expanding set of
                        technical skills.  I am eager to put all of this to work for a quality-driven organization.
                        Entry-level web developer with skills oriented toward client-side / UI development; HTML, CSS,
                        JavaScript, jQuery, and newly developed skills in AJAX / JSON. I have also worked with C#,
                        ASP.NET, and T-SQL.</p>
                </div>
                <div>
                    <h3 id="education">Education</h3>

                    <ul>
                        <li class="level1">&bull; Web Development Certification, Bellevue College, June 2012 &ndash;
                            June 2014, graduated with distinction, GPA in program &ndash; 4.0</li>
                        <li class="level1">&bull; Bachelor of Arts, Special Education, Seattle Pacific University,
                            January 2005 &ndash; March 2007, graduated Suma Cum Laude, Dean’s List, GPA &ndash; 3.9 </li>
                        <li class="level1">&bull; Associate of Arts, Bellevue Community College, June 2002 &ndash;
                            December 2004, graduated with honors</li>
                    </ul>
                </div>

                <div>
                    <h3 id="projects">Description of Projects in Portfolio</h3>
                    <ul>
                        <li class="level1">&bull; <a href="WellKit/Portfolio.pdf">WellKit Internship Portfolio</a>
                            : A detailed report on work that I did at WellKit Corporation</li>
                        <li class="level1">&bull;
                            <a href="Gallery/index.html">Gallery</a>
                            : A simulated commercial photo gallery written in JavaScript / jQuery and utilizing AJAX /JSON</li>
                        <li class="level1">&bull; <a href="calc/index.html">Calculator</a>
                            : An attractive multi-function calculator written in JavaScript / jQuery</li>
                        <li class="level1">&bull;
                            <a href="Quiz/select.html">Quiz</a>
                            : Written in JavaScript / jQuery, utilizes AJAX /JSON to deliver multiple quizzes</li>
                        <li class="level1">&bull; <a href="Uplift/index.html">Shafts of Light</a>
                            : A personal blog written in JavaScript / jQuery</li>
                    </ul>
                </div>

                <div> <a name="tech_skills"></a>

                    <h3 id="technical_skills">Technical Skills</h3>

                    <ul>
                        <li class="level1">&bull; HTML 5, CSS 3, JavaScript, jQuery, C# 5.0, ASP.NET 4.5, Visual Studio 2012, VBA </li>
                        <li class="level1">&bull; T-SQL queries, stored procedures, and schema design</li>
                        <li class="level1">&bull; Microsoft Excel, Word, PowerPoint, Outlook, Visio</li>
                        <li class="level1">&bull; SAP Crystal Reports 2012</li>
                        <li class="level1">&bull; Windows XP, Vista, 7, 8, and 8.1</li>
                    </ul>
                </div>

                <a name="ed"></a>

                <div> <a name="work_exp"></a>

                    <h3 id="work_experience">Work Experience</h3>

                    <p class="statement">Throughout my working career, in widely diverse sets of environments, I have
                        specialized in recognizing problems and needs, gathering and synthesizing information about the
                        need, creating innovative solutions to solve the problem or meet the need, and implementing the
                        solution effectively.</p>
                    <ul>
                        <li class="level1 job-title">&bull; Software Developer (Internship)</li>
                        <li class="level1 sub">WellKit Corporation, Bellevue WA<span class="float-right">June 2013 &ndash; Sept 2013</span> </li>
                        <li class="level2">&middot; Implemented website UI/UX features per specification using ASP.NET 4.5,
                            C# 5.0, SQL Server 7, HTML 5 and CSS 3</li>
                        <li class="level2">&middot; Wrote specification for, developed and implemented a portion of the
                            site (“News”) and an accompanying administration page</li>
                        <li class="level2">&middot; Wrote T-SQL stored procedures and C# classes for handling the data
                            associated with each corresponding query</li>
                        <li class="level1 job-title">&bull; Data Entry, inventory and infection control</li>
                        <li class="level2 sub">Issaquah Dental Lab, Issaquah WA<span class="float-right">Feb 2012 &ndash; Dec 2012</span></li>
                        <li class="level2">&middot; Maintained, updated, and created training and procedural materials</li>
                        <li class="level2">&middot; Recognized for increasing accuracy rate of data entry</li>
                        <li class="level1 job-title">&bull; Special Education Teacher</li>
                        <li class="level2 sub">Issaquah, Tahoma, and Snoqualmie Valley WA School districts<span class="float-right"> April 2002 – June 2012</span></li>
                        <li class="level2">&middot; Collaborated with multidisciplinary teams to write and maintained
                            highly detailed individual education plans</li>
                        <li class="level2">&middot; Designed, created, and delivered specially designed instruction to
                            students with special learning needs</li>
                        <li class="level2">&middot; Maintained daily communication with parents, administrators, and
                            multi-disciplinary teams, addressing concerns, resolving conflicts, and providing
                            solutions</li>
                        <li class="level2">&middot; Assisted parents through the process of coming to terms with their
                            children’s unique issues, and with the process of negotiating a complex educational
                            system</li>
                        <li class="level2">&middot; Managed teams of up to 5 aides in scheduling, training, delegating
                            tasks, and providing feedback</li>
                        <li class="level2">&middot; Worked as an aide in Special Education classes April 2002 -June 2004</li>
                        <li class="level1 job-title">&bull; Support Analyst</li>
                        <li class="level2 sub">Microsoft, Redmond WA<span class="float-right">1995 &ndash; 2002</span></li>
                        <li class="level2">&middot; Used QuickBasic, Visual Basic, and Windows logon script to write
                            utilities for managing software rollouts and standardization.  This greatly streamlined the
                            rollout process and reduced downtime and service calls, and won a company-wide award for
                            “Making It Easier”</li>
                        <li class="level2">&middot; Supported and maintained a utility program used by Helpdesk
                            companywide to install software </li>
                        <li class="level2">&middot; Created and regularly updated software images which were preloaded
                            onto all Dell computers purchased by Microsoft company-wide</li>
                        <li class="level1 job-title">&bull; Desktop Support</li>
                        <li class="level2 sub">Microsoft, Redmond WA<span class="float-right">1991 &ndash; 1995</span></li>
                        <li class="level2">&middot; Responded to requests for assistance from members of Inside Sales
                            team, focusing on mission-critical software issues</li>
                        <li class="level2">&middot; Recognized that the bulk of the problems were due to software
                            standardization issues and initiated a project to identify the issues and pioneer a
                            solution</li>
                        <li class="level1 job-title">&bull; Customer Service</li>
                        <li class="level2 sub">Microsoft, Redmond WA<span class="float-right">1986 &ndash; 1991</span></li>
                        <li class="level2">&middot; Provided telephone customer service support, dealt with defective
                            product replacement, product upgrades, and customer complaints</li>
                        <li class="level2">&middot; Handled first tier escalation for difficult customer situations due
                            to excellent conflict resolution skills, empathy and a calm, confident demeanor</li>
                        <li class="level2">&middot; Pioneered &ldquo;customer first&rdquo; paradigm within the
                            department</li>
                        <li class="level1 job-title">&bull; Member Relations</li>
                        <li class="level2 sub">Thousand Trails (membership campground and RV park provider)
                            <span class="float-right">1986</span></li>
                        <li class="level2">&middot; Responded to member-reported issues at Thousand Trail
                            &ldquo;Preserves&rdquo; (RV park / campgrounds), researched circumstances, interviewed
                            persons involved, and sought resolution with members via written communication</li>
                        <li class="level1 job-title">&bull; Clerk</li>
                        <li class="level2 sub">Thousand Trails, Bellevue WA<span class="float-right">1985 &ndash; 1986</span></li>
                        <li class="level2">Facilitated communication and transmission of materials between the home
                            office and 43 &ldquo;preserves&rdquo;</li>
                        <li class="level2">Identified and implemented cost cutting measures resulting in $12,000 annual
                            savings and earning annual award</li>
                        <li class="level1 job-title">&bull; Program Manager, Production Manager, Music Director (Radio broadcasting)</li>
                        <li class="level2 sub">KENE, Toppenish, WA and KFTN, Provo UT<span class="float-right">1979 &ndash; 1985</span></li>
                        <li class="level2">&middot; Programmed and operated top-rated automated Spanish language FM station</li>
                        <li class="level2">Music director and disk jockey, AM country music station</li>
                        <li class="level2">Gathered information about advertisers from sales people, wrote, produced,
                            and recorded creative, attention getting commercials</li>
                        <li class="level2">Recognized for superior production quality</li>
                    </ul>
                </div>
                <div> <a name="certs"></a>
                    <h3 id="certifications">Certifications</h3>
                    <ul>
                        <li class="level1">&bull; Microsoft Technical Associate: Software Development Fundamentals (98-361)</li>
                        <li class="level1">&bull; Microsoft Technical Associate: Windows Operating System Fundamentals (98-349)</li>
                    </ul>
                </div>
                <div> <a name="lang"></a>
                    <h3 id="languages">Languages</h3>
                    <ul>
                        <li class="level1">Speak, read, and write Spanish at basic working proficiency level</li>
                    </ul>
                </div>

            </div>
            <div id="toc_tab" title="Click to see table of contents">
                <img src="images/assets/menu-alt.png" alt="Menu icon">
            </div>
            <div id="toc" class="hidden">
                <h4>Table of Contents</h4>

                <ul>
                    <li><a href="#top" data-id="top">Top</a></li>
                    <li><a href="#ed" data-id="education">Education</a></li>
                    <li><a href="#accomp" data-id="projects">Projects in Portfolio</a></li>
                    <li><a href="#tech_skills" data-id="technical_skills">Technical Skills</a></li>
                    <li><a href="#work_exp" data-id="work_experience">Work Experience</a></li>
                    <li><a href="#certs" data-id="certifications">Certifications</a></li>
                    <li><a href="#lang" data-id="languages">Languages</a></li>
                    <hr>
                    <li>
                        <a href="https://www.linkedin.com/in/bryanpratt" title="Click to see my LinkedIn Profile"
                            target="_blank">
                            <img id="linkedin_logo" src="images/assets/LinkedInProfile.gif" alt="LinkedIn Logo">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- To be added at a later date
        <div id="about_tab">
            <p>About Me content.</p>
        </div>
        -->
        <div id="contact_tab">
            <div class="contact-div contact-div-left">
                <a href="mailto:blpratt1027@gmail.com?Subject=Response%20to%20Portfolio" title="Click to send me email">
                    <img class="portrait-img portrait-img-lg" alt="Me" src="images/LinkedIn_Profile_Picture-small.jpg"/>
                </a>
            </div>
            <div class="contact-div">
                <ul>
                    <li><a href="mailto:blpratt1027@gmail.com?Subject=Response%20to%20Portfolio">
                        <img class="contact-icon" src="images/assets/email.png"><span class="bold"> Email:</span>
                        <span class="uline"> blpratt1027@gmail.com</span></a>
                        <span class="em-text">(preferred method of contact)</span></li>
                    <li><a href="http://www.linkedin.com/in/bryanpratt"><img class="contact-icon" src="images/assets/linked_in.png">
                        <span class="bold"> LinkedIn: </span>
                        <span class="uline"> linkedin.com/in/bryanpratt</span></a></li>
                    <li><a href="https://github.com/blpratt1027/Portfolio"><img class="contact-icon" src="images/assets/github.png">
                        <span class="bold"> GitHub: </span>
                        <span class="uline">  github.com/blpratt1027/Portfolio</span></a></li>
                    <li><img class="contact-icon" src="images/assets/phone.png"><span class="bold"> Phone: </span> (425) 216-3748</li>
                </ul>
            </div>
        </div>
    </div>
    <script src="js/portfolio.js"></script>
    <script src="js/resume.js"></script>

    <div id="show_count" class="hidden">
        <p>Count...</p>
        <?php
$handle = fopen("counter.txt", "r");
if(!$handle){
	echo "could not open the file" ;
}
else {
	$counter = ( int ) fread ($handle,20) ;
	fclose ($handle) ;
	$counter++ ;
	echo $counter ;
        $handle = fopen("counter.txt", "w" ) ;
        fwrite($handle,$counter) ;
        fclose ($handle) ;
        }
        ?>
    </div>
</body>
</html>