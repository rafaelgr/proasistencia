ALTER TABLE `documentospago_facproves`   
  ADD COLUMN `antproveId` INT(11) NULL AFTER `facproveId`,
  ADD CONSTRAINT `antproveFK` FOREIGN KEY (`antproveId`) REFERENCES `antprove`(`antproveId`);
