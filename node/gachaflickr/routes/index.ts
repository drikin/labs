import express = module("express")

export function index(req, res){
  var user = req.user;
  if (user&&user.displayName !== undefined) {
    var name = user.displayName;
  } else {
    var name = 'GUEST';
  }
  res.render('index', {title: name, user: JSON.stringify(user)})
};
