const Notifications = (type, sender, link) => {
  if (type === 'newRequest') {
    return {
      title: 'New Travel Request',
      message: `${sender.firstName} ${sender.lastName}, just made a new travel request.`,
      url: `${process.env.APP_URL}/request/${link}`,
    };
  } if (type === 'approvedRequest') {
    return {
      title: 'Approved Request',
      message: 'Request approved by Line Manager, click to view.',
      url: `/request/${link}`
    };
  } if (type === 'rejectRequest') {
    return {
      title: 'Request Rejected',
      message: 'Request rejected by Line Manager, click to view.',
      url: `/request/${link}`
    };
  } if (type === 'newComment') {
    return {
      title: 'New Request Comment',
      message: `You have a new request comment from ${sender.firstName} ${sender.lastName}, click to reply.`,
      url: `/comments/${link}`
    };
  }
};

export default Notifications;
