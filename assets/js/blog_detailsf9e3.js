if ($('.main-head').length > 0) {
    // Remove any existing TOC to prevent duplicates
    $('.blog-heading .flow-rootx').remove();

    // Add wrapper section only once inside .blog-heading
    $('.blog-heading').append(`
        <p class="h5 fw--L">IN THIS ARTICLE:</p>
        <ul class="flow-rootx c--Cgray6 max-w-sm"></ul>
    `);

    var $tocList = $('.blog-heading ul.flow-rootx');

    // Loop through each main heading
    $('.main-head').each(function(index) {
        let text = $(this).text().trim();
        let id = $(this).attr('id');

        if (!id) {
            id = text.toLowerCase().replace(/\s+/g, '-'); 
            $(this).attr('id', id);
        }

        // Create LI
        let li = $('<li>');
        let mainLink = $('<a>', { href: '#' + id, text: text });
        li.append(mainLink);

        if (index === 0) li.addClass('active');

        // Collect sub-headings until next main-head
        let subHeads = $(this).nextUntil('.main-head').filter('.sub-head');
        if (subHeads.length > 0) {
            // Add SVG icon
            let icon = `
                <a class="icon-sec">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="31" viewBox="0 0 33 31">
                        <defs>
                            <style>.cls-1 { fill: none; stroke: #0035f5; stroke-width: 3px; fill-rule: evenodd; }</style>
                        </defs>
                        <path class="cls-1" d="M32.649,15.5H22.9s-6.524-.272-6.5,6.126v9.189" />
                        <path class="cls-1" d="M0.333,15.5H9.976s6.452,0.271,6.428-6.126V0.181" />
                    </svg>
                </a>
            `;
            li.append(icon);

            // Sub UL
            let subUl = $('<ul class="sub-list h6"></ul>');
            subHeads.each(function() {
                let subText = $(this).text().trim();
                let subId = $(this).attr('id');
                if (!subId) {
                    subId = subText.toLowerCase().replace(/\s+/g, '-'); 
                    $(this).attr('id', subId);
                }
                subUl.append($('<li>').append($('<a>', { href: '#' + subId, text: subText })));
            });
            li.append(subUl);
        }

        // Append LI inside wrapper UL
        $tocList.append(li);
    });

    $(".insight-details-page .side-nav ul>li a.icon-sec").click(function(e) {
        $(this).parent("li").toggleClass("show-subitems");
    });
}