package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc11Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc11.class);
        Abc11 abc111 = new Abc11();
        abc111.setId(1L);
        Abc11 abc112 = new Abc11();
        abc112.setId(abc111.getId());
        assertThat(abc111).isEqualTo(abc112);
        abc112.setId(2L);
        assertThat(abc111).isNotEqualTo(abc112);
        abc111.setId(null);
        assertThat(abc111).isNotEqualTo(abc112);
    }
}
