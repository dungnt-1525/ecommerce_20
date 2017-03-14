var config = {
    toolbar : [
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
    ]
};

CKEDITOR.replace( 'review', config);

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var review = data['review'];
var _url = data['routeStore'];
var type = 'POST';

if (review) {
    $("#edit").hide();
}

$("#edit-review").on('click', function(e) {
    e.preventDefault();
    $("#edit").show();
    $("#review-content").hide();
    _url = data['routeUpdate'];
    type = 'PUT';
});

$('#review-submit').on('click', function() {
    $.ajax({
        url: _url,
        type: type,
        data: {
            rating: $("#rating").rateit('value'),
            review: CKEDITOR.instances.review.getData(),
            product_id: data['productId'],
            user_id: data['userId'],
        },
    })
    .done(function(data) {
        $(".rating, .review").removeClass('text-danger').find("p").empty();
        $("#edit").hide();
        $("#review-content").show().find("#content").html(data[0]);
    })
    .fail(function(data) {
        var errors = data.responseJSON;
        $(".rating, .review").removeClass('text-danger').find("p").empty();

        if (errors['rating']) {
            $(".rating").addClass('text-danger').find("p").text(errors['rating'][0]);
        }

        if (errors['review']) {
            $(".review").addClass('text-danger').find("p").text(errors['review'][0]);
        }
    });
});