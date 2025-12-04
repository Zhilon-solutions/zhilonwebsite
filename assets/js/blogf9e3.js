$(document).ready(function () {
    function fetchResults(query, sort_by, page = 1) {
        $.ajax({
            url: SITE_URL+"blog/search",
            method: "GET",
            data: { q: query, page: page, sort_by: sort_by },
            beforeSend: function() {
                $('.loader').show();
            },
            complete: function() {
                $('.loader').hide();
            },
            success: function (data) {
                $('#blogSearchResults').html('');
                $('#blogSearchResults').html(data);
            }
        });
    }

    // Stop default form submit, trigger AJAX instead
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        let query = $('#search').val();
        let sort_by = $('#sort_by').val(); 

        fetchResults(query, sort_by);
    });
    // Sort By 
    $('#sort_by').on('change', function() {
        let query = $('#search').val();
        let sort_by = $('#sort_by').val(); 
        let page = $('.pagenavigation li.active a').data('page');

        fetchResults(query, sort_by, page);
    });

    // Handle pagination click
    $(document).on('click', '.pagenavigation a', function (e) {
        e.preventDefault();
        let pageUrl = $(this).attr('href');
        let page = pageUrl.split('page=')[1];
        let query = $('#search').val();
        let sort_by = $('#sort_by').val(); 

        fetchResults(query, sort_by, page);
    });
});
