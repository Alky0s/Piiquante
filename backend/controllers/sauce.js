// We import sauce model and fs package
const Sauce = require('../models/sauce');
const fs = require('fs');

// Middlewares to create and export

// POST a new sauce 
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
};

// GET 1 sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// PUT, to modify
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message : 'Unauthorized request'});
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
  .catch((error) => {
    res.status(400).json({ error });
  });
};

// DELETE 
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
  .catch( error => {
      res.status(500).json({ error });
  });
};

// GET all
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// POST like / dislike system
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then((sauce) => {
      // Using Switch case method
      switch(req.body.like) {
        case 1 : 
        // IF THE USER DIDN'T LIKE YET
          if(!sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              {_id : req.params.id},
              { $inc: {likes : +1}, $push: {usersLiked: req.body.userId}, _id : req.params.id}
            )
            .then(() => res.status(201).json())
            .catch((error) => res.status(400).json({error}));
          }
          break;
        case -1 :
        // IF THE USER DIDN'T DISLIKE YET
          if(!sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              {_id : req.params.id},
              { $inc: {dislikes : +1}, $push: {usersDisliked: req.body.userId}, _id : req.params.id}
            )
            .then(() => res.status(201).json())
            .catch((error) => res.status(400).json({error}));
          }
          break;
        case 0 :
        // IF THE USER HAS ALREADY LIKED
          if(sauce.usersLiked.includes(req.body.userId)){
            Sauce.updateOne(
              {_id : req.params.id},
              {$inc: {likes : -1}, $pull: {usersLiked: req.body.userId}, _id : req.params.id}
            )
            .then(() => res.status(201).json())
            .catch((error) => res.status(400).json({error}));
          } 
        // IF THE USER HAS ALREADY DISLIKED
          else if(sauce.usersDisliked.includes(req.body.userId)){
            Sauce.updateOne(
              {_id : req.params.id},
              { $inc: {dislikes : -1}, $pull: {usersDisliked: req.body.userId}, _id : req.params.id}
            )
            .then(() => res.status(201).json())
            .catch((error) => res.status(400).json({error}));
          }  
          break;  
        default: console.log("erreur");
      }
    })
    .catch((error) => res.status(404).json({error}));
};