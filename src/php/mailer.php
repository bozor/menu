<?php
 
    class GoogleRecaptcha 
    {
        /* Google recaptcha API url */
        private $google_url = "https://www.google.com/recaptcha/api/siteverify";
        private $secret = '6LdRIQsTAAAAALoGaGEVVANp7uI4rHPEmespfav0';
     
        public function VerifyCaptcha($response)
        {
            $url = $this->google_url."?secret=".$this->secret."&response=".$response;
     
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($curl, CURLOPT_TIMEOUT, 15);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE); 
            $curlData = curl_exec($curl);
     
            curl_close($curl);
     
            $res = json_decode($curlData, TRUE);
            if($res['success'] == 'true') 
                return TRUE;
            else
                return FALSE;
        }
     
    }
    
    function sendEmail(){
        $mail_from = "website@test.com";
        $mail_to = "boris.grudinin@gmail.com";
        $mail_subject = "Contact from website";
        $form_name = $_POST['form-name'];
        $body = "Hello,\nA user has contacted you through the website. Their details are below:\n\n";
        $headers = "From: $mail_from" . "\n" . "Reply-To: $mail_from" . "\n" . "X-Mailer: PHP/" . phpversion();

        $body .= "Name: " . $_POST['form-name'] . "\n";
        $body .= "Email: " . $_POST["form-email"] . "\n";

        if( isset($_POST["form-phone"]) && $_POST["form-phone"] != "" ) {
            $body .= "Phone: " . $_POST["form-phone"] . "\n";
        }

        switch($_POST["form-option"]){
            case 'a':
                $mail_subject = "Contact from website - a";
                if( isset($_POST["form-company"]) && $_POST["form-company"] != "" ) {
                    $body .= "Company: " . $_POST["form-company"] . "\n";
                }

                if( isset($_POST["form-country"]) && $_POST["form-country"] != "" ) {
                    $body .= "Country: " . $_POST["form-country"] . "\n";
                }

                if( isset($_POST["form-message"]) && $_POST["form-message"] != "" ) {
                    $body .= "Message: " . $_POST["form-message"] . "\n";
                }
                break;
            case 'b':
                $mail_subject = "Contact from website - b";
                if( isset($_POST["form-message"]) && $_POST["form-message"] != "" ) {
                    $body .= "Message: " . $_POST["form-message"] . "\n";
                }
                break;
            case 'c':
                $mail_subject = "Contact from website - c";
                if( isset($_POST["form-serial"]) && $_POST["form-serial"] != "" ) {
                    $body .= "Serial no: " . $_POST["form-serial"] . "\n";
                }

                if( isset($_POST["form-product"]) && $_POST["form-product"] != "" ) {
                    $body .= "Product: " . $_POST["form-serial"] . "\n";
                }

                if( isset($_POST["form-message"]) && $_POST["form-message"] != "" ) {
                    $body .= "Message: " . $_POST["form-message"] . "\n";
                }

                //$mail_to = "boris.grudinin@gmail.com , support@temp";
                break;
            default:
                $mail_subject = "Contact from website - general";
                if( isset($_POST["form-message"]) && $_POST["form-message"] != "" ) {
                    $body .= "Message: " . $_POST["form-message"] . "\n";
                }
                break;
        }

        $body .= "\nThis is an automated email, please do not reply to it.";

        if ( mail($mail_to, $mail_subject, $body, $headers) ) {
            echo "<div class=\"success\"><h2>Thank you</h2><p>One of our representatives will be in touch shortly.</p></div>";
        } else {
            echo "<div class=\"error\"><h2>Error</h2><p>We are sorry but something went wrong. Please try again later.</p></div>";
        }
    }

    $message = '';
     
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        $response = $_POST['g-recaptcha-response'];
     
        if(!empty($response))
        {
            $cap = new GoogleRecaptcha();
            $verified = $cap->VerifyCaptcha($response);

            if($verified) {
                sendEmail();
            } else {
                $message = "Please reenter captcha";
            }
        } 
        else
        {
            $message = "Please reenter captcha";
        }

        echo $message;
    }
 
?>