CREATE TRIGGER prev_monh_2 BEFORE UPDATE ON Payments FOR EACH ROW WHEN (new.IS_PAYED = 1 AND new.payment_period = 'monthly')
DECLARE 
PREV_STATUS NUMBER;
pragma autonomous_transaction;
BEGIN
BEGIN
SELECT IS_PAYED INTO PREV_STATUS
    FROM PAYMENTS
    WHERE
      :new.gardener_id = Payments.gardener_id AND :new.payment_type = Payments.payment_type AND ((EXTRACT ( month from Payments.deadline_date ) = EXTRACT( month from add_months( :new.deadline_date, -1 ))) OR (EXTRACT ( month from Payments.deadline_date ) = EXTRACT( month from  :new.deadline_date)));
DBMS_OUTPUT.PUT_LINE(PREV_STATUS);    
DBMS_OUTPUT.PUT_LINE(EXTRACT( month from add_months( :new.deadline_date, -1 )));

    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        PREV_STATUS := NULL;
    END;  
  IF (
    PREV_STATUS <> 1
  )
  THEN
    raise_application_error(
      -20007,
      'Cannot create payment because of unpaid payment of the same type'
    );
  END IF;
END prev_month;
