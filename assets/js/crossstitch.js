$('img').modal({
    title: 'Important Notice',
    class: 'mini',
    closeIcon: true,
    content: 'You will be logged out in 5 Minutes',
    actions: [{
      text: 'Alright, got it',
      class: 'green'
    }]
}).modal('show');
