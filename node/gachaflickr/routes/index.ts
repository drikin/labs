import express = module("express")

export function index(req, res){
  var user = req.user;
  if (user&&user.displayName === undefined) {
    user.displayName = 'GUEST';
  }
  res.render('index', {title: user.displayName, user: JSON.stringify(user)})
};
